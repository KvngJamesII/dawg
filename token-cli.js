#!/usr/bin/env node
// Token Management CLI Tool
import { tokenService } from './src/services/tokenService.js';

const args = process.argv.slice(2);
const command = args[0];

const COMMANDS = {
  create: 'Create a new API token',
  list: 'List all tokens',
  info: 'Get token info',
  update: 'Update token settings',
  delete: 'Delete a token',
  reset: 'Reset token usage',
  help: 'Show this help'
};

function printHelp() {
  console.log('');
  console.log('🔑 API Token Management CLI');
  console.log('===========================');
  console.log('');
  console.log('Commands:');
  console.log('');
  console.log('  create <name> [dailyLimit] [totalLimit]');
  console.log('    Create a new API token');
  console.log('    Example: node token-cli.js create "John Doe" 100 1000');
  console.log('');
  console.log('  list');
  console.log('    List all API tokens');
  console.log('');
  console.log('  info <token>');
  console.log('    Get detailed info about a token');
  console.log('');
  console.log('  update <token> <field> <value>');
  console.log('    Update token settings (fields: name, dailyLimit, totalLimit, active)');
  console.log('    Example: node token-cli.js update sk_live_xxx dailyLimit 500');
  console.log('');
  console.log('  delete <token>');
  console.log('    Delete a token');
  console.log('');
  console.log('  reset <token> [--total]');
  console.log('    Reset token usage (add --total to also reset total usage)');
  console.log('');
  console.log('  help');
  console.log('    Show this help message');
  console.log('');
}

function formatTable(data, columns) {
  if (data.length === 0) {
    console.log('No tokens found');
    return;
  }

  // Calculate column widths
  const widths = {};
  for (const col of columns) {
    widths[col] = col.length;
    for (const row of data) {
      const val = String(row[col] ?? '');
      widths[col] = Math.max(widths[col], val.length);
    }
  }

  // Print header
  const header = columns.map(col => col.padEnd(widths[col])).join(' | ');
  console.log(header);
  console.log('-'.repeat(header.length));

  // Print rows
  for (const row of data) {
    const line = columns.map(col => String(row[col] ?? '').padEnd(widths[col])).join(' | ');
    console.log(line);
  }
}

async function main() {
  switch (command) {
    case 'create': {
      const name = args[1];
      const dailyLimit = parseInt(args[2]) || 100;
      const totalLimit = parseInt(args[3]) || 0;

      if (!name) {
        console.error('❌ Error: Name is required');
        console.log('Usage: node token-cli.js create <name> [dailyLimit] [totalLimit]');
        process.exit(1);
      }

      const token = tokenService.createToken({ name, dailyLimit, totalLimit });
      
      console.log('');
      console.log('✅ API Token Created Successfully!');
      console.log('');
      console.log('┌─────────────────────────────────────────────────────────────┐');
      console.log('│  🔑 YOUR API KEY (save this - you won\'t see it again!)     │');
      console.log('├─────────────────────────────────────────────────────────────┤');
      console.log(`│  ${token.token}  │`);
      console.log('└─────────────────────────────────────────────────────────────┘');
      console.log('');
      console.log('Token Details:');
      console.log(`  Name:        ${token.name}`);
      console.log(`  Daily Limit: ${token.dailyLimit === 0 ? 'Unlimited' : token.dailyLimit + ' requests/day'}`);
      console.log(`  Total Limit: ${token.totalLimit === 0 ? 'Unlimited' : token.totalLimit + ' requests total'}`);
      console.log(`  Created:     ${token.createdAt}`);
      console.log('');
      console.log('Usage:');
      console.log('  curl -X POST http://localhost:3000/api/tiktok \\');
      console.log(`    -H "X-API-Key: ${token.token}" \\`);
      console.log('    -H "Content-Type: application/json" \\');
      console.log('    -d \'{"url": "https://vt.tiktok.com/ZSxxx/"}\'');
      console.log('');
      break;
    }

    case 'list': {
      const tokens = tokenService.listTokens();
      
      console.log('');
      console.log('📋 API Tokens');
      console.log('');
      
      if (tokens.length === 0) {
        console.log('No tokens found. Create one with: node token-cli.js create "Name"');
      } else {
        const data = tokens.map(t => ({
          name: t.name,
          token: t.token,
          daily: `${t.usage.daily}/${t.dailyLimit || '∞'}`,
          total: `${t.usage.total}/${t.totalLimit || '∞'}`,
          active: t.active ? '✓' : '✗',
          lastUsed: t.lastUsedAt ? new Date(t.lastUsedAt).toLocaleDateString() : 'Never'
        }));
        
        formatTable(data, ['name', 'token', 'daily', 'total', 'active', 'lastUsed']);
      }
      console.log('');
      break;
    }

    case 'info': {
      const token = args[1];
      
      if (!token) {
        console.error('❌ Error: Token is required');
        console.log('Usage: node token-cli.js info <token>');
        process.exit(1);
      }

      const info = tokenService.getTokenInfo(token);
      
      if (!info) {
        console.error('❌ Token not found');
        process.exit(1);
      }

      console.log('');
      console.log('🔑 Token Information');
      console.log('');
      console.log(`  Name:         ${info.name}`);
      console.log(`  Token:        ${info.token.substring(0, 20)}...`);
      console.log(`  Active:       ${info.active ? 'Yes ✓' : 'No ✗'}`);
      console.log(`  Daily Limit:  ${info.dailyLimit === 0 ? 'Unlimited' : info.dailyLimit}`);
      console.log(`  Total Limit:  ${info.totalLimit === 0 ? 'Unlimited' : info.totalLimit}`);
      console.log('');
      console.log('📊 Usage:');
      console.log(`  Today:        ${info.usage.daily} requests`);
      console.log(`  Total:        ${info.usage.total} requests`);
      console.log(`  Last Reset:   ${info.usage.lastReset}`);
      console.log(`  Last Used:    ${info.lastUsedAt || 'Never'}`);
      console.log(`  Created:      ${info.createdAt}`);
      console.log('');
      break;
    }

    case 'update': {
      const token = args[1];
      const field = args[2];
      const value = args[3];

      if (!token || !field || value === undefined) {
        console.error('❌ Error: Token, field, and value are required');
        console.log('Usage: node token-cli.js update <token> <field> <value>');
        console.log('Fields: name, dailyLimit, totalLimit, active');
        process.exit(1);
      }

      const updates = {};
      if (field === 'active') {
        updates[field] = value === 'true' || value === '1';
      } else if (field === 'dailyLimit' || field === 'totalLimit') {
        updates[field] = parseInt(value);
      } else {
        updates[field] = value;
      }

      const updated = tokenService.updateToken(token, updates);
      
      if (!updated) {
        console.error('❌ Token not found');
        process.exit(1);
      }

      console.log(`✅ Token updated: ${field} = ${updates[field]}`);
      break;
    }

    case 'delete': {
      const token = args[1];
      
      if (!token) {
        console.error('❌ Error: Token is required');
        console.log('Usage: node token-cli.js delete <token>');
        process.exit(1);
      }

      const success = tokenService.deleteToken(token);
      
      if (!success) {
        console.error('❌ Token not found');
        process.exit(1);
      }

      console.log('✅ Token deleted');
      break;
    }

    case 'reset': {
      const token = args[1];
      const resetTotal = args.includes('--total');
      
      if (!token) {
        console.error('❌ Error: Token is required');
        console.log('Usage: node token-cli.js reset <token> [--total]');
        process.exit(1);
      }

      const success = tokenService.resetUsage(token, resetTotal);
      
      if (!success) {
        console.error('❌ Token not found');
        process.exit(1);
      }

      console.log(resetTotal ? '✅ Daily and total usage reset' : '✅ Daily usage reset');
      break;
    }

    case 'help':
    default:
      printHelp();
      break;
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
