import express from 'express';
import {
  initializeTransaction,
  verifyTransaction,
  processSuccessfulPayment,
  verifyWebhookSignature,
  getUserTransactions,
  getPublicKey,
  CREDIT_PACKAGES,
} from '../services/paystackService.js';
import { verifyToken, getUserById } from '../services/userService.js';

const router = express.Router();

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'No token provided',
    });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }

  req.userId = decoded.id;
  req.userEmail = decoded.email;
  next();
};

// Get available credit packages
router.get('/packages', (req, res) => {
  res.json({
    success: true,
    packages: CREDIT_PACKAGES,
  });
});

// Get Paystack public key
router.get('/config', (req, res) => {
  const publicKey = getPublicKey();
  res.json({
    success: true,
    publicKey: publicKey || null,
    configured: !!publicKey,
  });
});

// Initialize payment
router.post('/initialize', authMiddleware, async (req, res) => {
  try {
    const { packageId } = req.body;

    if (!packageId) {
      return res.status(400).json({
        success: false,
        error: 'Package ID is required',
      });
    }

    const user = getUserById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const result = await initializeTransaction(req.userId, packageId, user.email);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Verify payment (called after redirect from Paystack)
router.get('/verify/:reference', authMiddleware, async (req, res) => {
  try {
    const { reference } = req.params;

    const paystackData = await verifyTransaction(reference);

    if (paystackData.status !== 'success') {
      return res.status(400).json({
        success: false,
        error: 'Payment was not successful',
        status: paystackData.status,
      });
    }

    const result = processSuccessfulPayment(reference, paystackData);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Payment callback (redirect URL after Paystack payment)
router.get('/callback', async (req, res) => {
  const { reference, trxref } = req.query;
  const ref = reference || trxref;
  const frontendUrl = process.env.FRONTEND_URL || '';

  if (!ref) {
    return res.redirect(`${frontendUrl}/dashboard/purchase?error=no_reference`);
  }

  try {
    const paystackData = await verifyTransaction(ref);

    if (paystackData.status === 'success') {
      processSuccessfulPayment(ref, paystackData);
      res.redirect(`${frontendUrl}/dashboard/purchase?success=true&reference=${ref}`);
    } else {
      res.redirect(`${frontendUrl}/dashboard/purchase?error=payment_failed`);
    }
  } catch (error) {
    console.error('Payment callback error:', error);
    res.redirect(`${frontendUrl}/dashboard/purchase?error=verification_failed`);
  }
});

// Paystack webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['x-paystack-signature'];

  // Verify webhook signature
  if (!verifyWebhookSignature(req.body, signature)) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  const event = JSON.parse(req.body);

  if (event.event === 'charge.success') {
    try {
      const reference = event.data.reference;
      processSuccessfulPayment(reference, event.data);
    } catch (error) {
      console.error('Webhook processing error:', error);
    }
  }

  res.sendStatus(200);
});

// Get user's transaction history
router.get('/transactions', authMiddleware, (req, res) => {
  try {
    const transactions = getUserTransactions(req.userId);
    res.json({
      success: true,
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
