import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const USERS_FILE = join(__dirname, '..', 'database', 'users.json');
const TRANSACTIONS_FILE = join(__dirname, '..', 'database', 'transactions.json');

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY;

// Credit packages
export const CREDIT_PACKAGES = [
  { id: 'starter', name: 'Starter', credits: 5000, price: 200, currency: 'NGN', priceUSD: 2 },
  { id: 'growth', name: 'Growth', credits: 15000, price: 500, currency: 'NGN', priceUSD: 5 },
  { id: 'pro', name: 'Pro', credits: 50000, price: 1500, currency: 'NGN', priceUSD: 15 },
  { id: 'enterprise', name: 'Enterprise', credits: 200000, price: 5000, currency: 'NGN', priceUSD: 50 },
];

// Helper to read users
function readUsers() {
  if (!existsSync(USERS_FILE)) {
    return [];
  }
  const data = JSON.parse(readFileSync(USERS_FILE, 'utf8'));
  return data.users || [];
}

// Helper to write users
function writeUsers(users) {
  writeFileSync(USERS_FILE, JSON.stringify({ users }, null, 2));
}

// Helper to read transactions
function readTransactions() {
  if (!existsSync(TRANSACTIONS_FILE)) {
    writeFileSync(TRANSACTIONS_FILE, JSON.stringify({ transactions: [] }, null, 2));
    return [];
  }
  const data = JSON.parse(readFileSync(TRANSACTIONS_FILE, 'utf8'));
  return data.transactions || [];
}

// Helper to write transactions
function writeTransactions(transactions) {
  writeFileSync(TRANSACTIONS_FILE, JSON.stringify({ transactions }, null, 2));
}

// Initialize a Paystack transaction
export async function initializeTransaction(userId, packageId, email) {
  const pkg = CREDIT_PACKAGES.find(p => p.id === packageId);
  if (!pkg) {
    throw new Error('Invalid package selected');
  }

  if (!PAYSTACK_SECRET_KEY) {
    throw new Error('Paystack is not configured');
  }

  const reference = `txn_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
  const callbackUrl = process.env.PAYSTACK_CALLBACK_URL || 'https://api.idledeveloper.tech/api/payments/callback';

  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount: pkg.price * 100, // Paystack expects amount in kobo
      currency: pkg.currency,
      reference,
      callback_url: callbackUrl,
      metadata: {
        userId,
        packageId,
        credits: pkg.credits,
      },
    }),
  });

  const data = await response.json();

  if (!data.status) {
    throw new Error(data.message || 'Failed to initialize transaction');
  }

  // Save pending transaction
  const transactions = readTransactions();
  transactions.push({
    id: reference,
    userId,
    packageId,
    credits: pkg.credits,
    amount: pkg.price,
    currency: pkg.currency,
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
  writeTransactions(transactions);

  return {
    authorizationUrl: data.data.authorization_url,
    accessCode: data.data.access_code,
    reference: data.data.reference,
  };
}

// Verify a Paystack transaction
export async function verifyTransaction(reference) {
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error('Paystack is not configured');
  }

  const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: {
      'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
    },
  });

  const data = await response.json();

  if (!data.status) {
    throw new Error(data.message || 'Failed to verify transaction');
  }

  return data.data;
}

// Process successful payment
export function processSuccessfulPayment(reference, paystackData) {
  const transactions = readTransactions();
  const transaction = transactions.find(t => t.id === reference);

  if (!transaction) {
    throw new Error('Transaction not found');
  }

  if (transaction.status === 'completed') {
    return { alreadyProcessed: true };
  }

  // Update transaction status
  transaction.status = 'completed';
  transaction.paystackReference = paystackData.reference;
  transaction.completedAt = new Date().toISOString();
  writeTransactions(transactions);

  // Add credits to user
  const users = readUsers();
  const user = users.find(u => u.id === transaction.userId);

  if (!user) {
    throw new Error('User not found');
  }

  user.credits = (user.credits || 0) + transaction.credits;
  user.updatedAt = new Date().toISOString();
  writeUsers(users);

  return {
    success: true,
    creditsAdded: transaction.credits,
    newBalance: user.credits,
  };
}

// Handle Paystack webhook
export function verifyWebhookSignature(payload, signature) {
  if (!PAYSTACK_SECRET_KEY) {
    return false;
  }

  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(payload))
    .digest('hex');

  return hash === signature;
}

// Get user transactions
export function getUserTransactions(userId) {
  const transactions = readTransactions();
  return transactions
    .filter(t => t.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// Get public key for frontend
export function getPublicKey() {
  return PAYSTACK_PUBLIC_KEY;
}
