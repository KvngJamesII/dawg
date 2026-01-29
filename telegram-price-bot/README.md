# 🚀 Crypto Price Alert Telegram Bot

A powerful Telegram bot that monitors cryptocurrency prices using DexScreener API and alerts users when price targets are hit.

## Features

- 📊 **Track Any Token** - Send a contract address (CA) to track any token on supported chains
- 🔔 **Price Alerts** - Set alerts for price increases or decreases
- 📈 **Multiple Alert Types**:
  - Up 10%, 20%, 50%, 100%
  - Down 10%, 20%, 50%
  - Custom percentage (positive or negative)
  - Price target alerts
  - Any change alerts (±5%)
- 👀 **Watchlist** - Keep track of your favorite tokens
- 📱 **Real-time Notifications** - Get instant alerts when targets are hit
- 🌐 **Multi-chain Support** - Ethereum, BSC, Polygon, Solana, Arbitrum, Base, and more!

## Supported Chains

- Ethereum (ETH)
- Binance Smart Chain (BSC)
- Polygon (MATIC)
- Solana (SOL)
- Arbitrum
- Base
- Avalanche
- Fantom
- And many more via DexScreener!

## Installation

### Prerequisites

- Python 3.9 or higher
- A Telegram Bot Token (get from [@BotFather](https://t.me/botfather))

### Setup

1. **Clone or navigate to the bot directory:**
   ```bash
   cd telegram-price-bot
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure the bot:**
   
   Edit the `.env` file with your bot token:
   ```env
   BOT_TOKEN=your_bot_token_here
   ```

5. **Run the bot:**
   ```bash
   python bot.py
   ```

## Usage

### Commands

| Command | Description |
|---------|-------------|
| `/start` | Start the bot and see welcome message |
| `/track <CA>` | Track a token by contract address |
| `/alerts` | View all your active alerts |
| `/delete` | Delete a specific alert |
| `/portfolio` | View your tracked tokens/watchlist |
| `/stats` | View your alert statistics |
| `/help` | Show help message |

### How to Set an Alert

1. **Send a contract address** to the bot (e.g., `0x...` for EVM or Solana address)
2. The bot will fetch token info from DexScreener
3. **Select your alert type** from the buttons:
   - 📈 Up 10%, 20%, 50%, 100%
   - 📉 Down 10%, 20%, 50%
   - 🎯 Custom % - Enter any percentage
   - ⏰ Price Target - Set a specific price
   - 🔔 Any Change 5% - Alert on any 5% movement

4. **Receive notifications** when your target is hit!

### Example

```
You: 0xdAC17F958D2ee523a2206206994597C13D831ec7

Bot: 🪙 Tether USD ($USDT)
     💰 Price: $1.0001
     📈 24h Change: +0.01%
     💧 Liquidity: $500M
     
     [📈 Up 10%] [📈 Up 20%]
     [📉 Down 10%] [🎯 Custom %]
```

## Project Structure

```
telegram-price-bot/
├── bot.py              # Main bot file
├── price_monitor.py    # DexScreener API integration
├── database.py         # JSON-based data storage
├── requirements.txt    # Python dependencies
├── .env               # Configuration file
├── README.md          # This file
└── data/              # Data storage (created automatically)
    ├── alerts.json    # User alerts
    ├── users.json     # User data
    └── watchlist.json # User watchlists
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BOT_TOKEN` | Your Telegram bot token | Required |
| `LOG_LEVEL` | Logging level | `INFO` |
| `PRICE_CHECK_INTERVAL` | Price check interval (seconds) | `30` |

## API Reference

This bot uses the [DexScreener API](https://docs.dexscreener.com/) to fetch token prices:

- **Token lookup**: `GET /latest/dex/tokens/{tokenAddress}`
- **Search**: `GET /latest/dex/search?q={query}`

## Limitations

- DexScreener API has rate limits - the bot implements caching and batching
- Alerts are checked every 30 seconds (configurable)
- Data is stored in JSON files (suitable for small to medium usage)

## Security Notes

⚠️ **Important:**
- Never share your bot token publicly
- The `.env` file should be added to `.gitignore`
- This bot stores minimal user data (Telegram user ID, alerts)

## Troubleshooting

### Bot not responding?
- Check if the bot token is correct
- Ensure Python dependencies are installed
- Check the console for error messages

### Token not found?
- Make sure the contract address is correct
- The token must have liquidity on a DEX tracked by DexScreener

### Alerts not triggering?
- The price monitor checks every 30 seconds
- Ensure the bot is running continuously

## Contributing

Feel free to submit issues and pull requests!

## License

MIT License - feel free to use and modify!

---

Made with ❤️ for crypto traders
