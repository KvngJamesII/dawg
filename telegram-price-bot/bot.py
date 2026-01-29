import os
import asyncio
import logging
from datetime import datetime
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    CallbackQueryHandler,
    ConversationHandler,
    filters,
    ContextTypes,
)
from dotenv import load_dotenv
from price_monitor import PriceMonitor
from database import Database

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Bot token
BOT_TOKEN = os.getenv('BOT_TOKEN', '8472876966:AAFxO8QjCbv2oc_rCKp_qcTUXyYUXmw5Rw8')

# Conversation states
WAITING_FOR_CA, WAITING_FOR_CUSTOM_PERCENT = range(2)

# Initialize database and price monitor
db = Database()
price_monitor = PriceMonitor(db)


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send a welcome message when the /start command is issued."""
    user = update.effective_user
    welcome_message = f"""
🚀 *Welcome to Crypto Price Alert Bot, {user.first_name}!*

I help you track cryptocurrency prices and alert you when they hit your targets.

*Commands:*
/track `<contract_address>` - Track a token by contract address
/alerts - View your active alerts
/delete - Delete an alert
/portfolio - View all tracked tokens
/help - Show help message

*How to use:*
1. Send me a contract address (CA) or use /track
2. I'll fetch the token info from DexScreener
3. Choose your price alert target
4. Get notified when the price hits your target! 🎯

Let's get started! Send me a contract address to track.
    """
    await update.message.reply_text(welcome_message, parse_mode='Markdown')


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send help message."""
    help_text = """
📖 *Help Guide*

*Basic Commands:*
• /start - Start the bot
• /track `<CA>` - Track a token by contract address
• /alerts - View all your active alerts
• /delete - Delete a specific alert
• /portfolio - View your tracked tokens
• /stats - View your alert statistics

*Setting Alerts:*
1. Send a contract address or use /track
2. Select alert type (Up/Down percentage)
3. For custom alerts, enter your desired percentage

*Supported Chains:*
• Ethereum (ETH)
• Binance Smart Chain (BSC)
• Polygon (MATIC)
• Solana (SOL)
• Arbitrum
• Base
• And many more!

*Tips:*
• You can track multiple tokens
• Set multiple alerts per token
• Alerts trigger once and are removed

Need help? Contact @YourSupport
    """
    await update.message.reply_text(help_text, parse_mode='Markdown')


async def handle_contract_address(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Handle when user sends a contract address."""
    text = update.message.text.strip()
    user_id = update.effective_user.id
    
    # Check if it looks like a contract address
    if not is_valid_contract_address(text):
        await update.message.reply_text(
            "❌ That doesn't look like a valid contract address.\n"
            "Please send a valid CA (e.g., 0x... for EVM or a Solana address)"
        )
        return ConversationHandler.END
    
    # Show loading message
    loading_msg = await update.message.reply_text("🔍 Fetching token info from DexScreener...")
    
    # Fetch token info
    token_info = await price_monitor.get_token_info(text)
    
    if not token_info:
        await loading_msg.edit_text(
            "❌ Token not found on DexScreener.\n"
            "Make sure the contract address is correct and the token has liquidity."
        )
        return ConversationHandler.END
    
    # Store the token info in context for later use
    context.user_data['current_token'] = token_info
    context.user_data['contract_address'] = text
    
    # Format token info message
    price_usd = token_info.get('priceUsd', 'N/A')
    price_change_24h = token_info.get('priceChange24h', 0)
    liquidity = token_info.get('liquidity', 'N/A')
    volume_24h = token_info.get('volume24h', 'N/A')
    
    change_emoji = "📈" if price_change_24h >= 0 else "📉"
    
    token_message = f"""
🪙 *{token_info.get('name', 'Unknown')}* (${token_info.get('symbol', 'N/A')})

💰 *Price:* ${format_number(price_usd)}
{change_emoji} *24h Change:* {price_change_24h:+.2f}%
💧 *Liquidity:* ${format_number(liquidity)}
📊 *24h Volume:* ${format_number(volume_24h)}
🔗 *Chain:* {token_info.get('chain', 'Unknown').upper()}
📍 *DEX:* {token_info.get('dex', 'Unknown')}

*Select an alert option below:*
    """
    
    # Create inline keyboard with alert options
    keyboard = [
        [
            InlineKeyboardButton("📈 Up 10%", callback_data="alert_up_10"),
            InlineKeyboardButton("📈 Up 20%", callback_data="alert_up_20"),
        ],
        [
            InlineKeyboardButton("📈 Up 50%", callback_data="alert_up_50"),
            InlineKeyboardButton("📈 Up 100%", callback_data="alert_up_100"),
        ],
        [
            InlineKeyboardButton("📉 Down 10%", callback_data="alert_down_10"),
            InlineKeyboardButton("📉 Down 20%", callback_data="alert_down_20"),
        ],
        [
            InlineKeyboardButton("📉 Down 50%", callback_data="alert_down_50"),
            InlineKeyboardButton("🎯 Custom %", callback_data="alert_custom"),
        ],
        [
            InlineKeyboardButton("⏰ Price Target", callback_data="alert_price_target"),
            InlineKeyboardButton("🔔 Any Change 5%", callback_data="alert_any_5"),
        ],
        [
            InlineKeyboardButton("📊 Add to Watchlist", callback_data="add_watchlist"),
            InlineKeyboardButton("❌ Cancel", callback_data="cancel"),
        ],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await loading_msg.edit_text(token_message, parse_mode='Markdown', reply_markup=reply_markup)
    return WAITING_FOR_CA


async def track_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Handle /track command."""
    if context.args:
        # If CA is provided with command
        update.message.text = context.args[0]
        return await handle_contract_address(update, context)
    else:
        await update.message.reply_text(
            "📝 Please send me the contract address (CA) you want to track:"
        )
        return WAITING_FOR_CA


async def button_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Handle button callbacks."""
    query = update.callback_query
    await query.answer()
    
    user_id = update.effective_user.id
    callback_data = query.data
    
    if callback_data == "cancel":
        await query.edit_message_text("❌ Operation cancelled.")
        return ConversationHandler.END
    
    if callback_data == "add_watchlist":
        token_info = context.user_data.get('current_token')
        if token_info:
            db.add_to_watchlist(user_id, token_info)
            await query.edit_message_text(
                f"✅ *{token_info.get('name')}* added to your watchlist!\n"
                "Use /portfolio to view your tracked tokens.",
                parse_mode='Markdown'
            )
        return ConversationHandler.END
    
    if callback_data == "alert_custom":
        await query.edit_message_text(
            "🎯 *Custom Alert*\n\n"
            "Enter your custom percentage:\n"
            "• Use positive number for price UP (e.g., `25` for +25%)\n"
            "• Use negative number for price DOWN (e.g., `-15` for -15%)\n\n"
            "Example: `35` or `-25`",
            parse_mode='Markdown'
        )
        return WAITING_FOR_CUSTOM_PERCENT
    
    if callback_data == "alert_price_target":
        await query.edit_message_text(
            "💰 *Price Target Alert*\n\n"
            "Enter your target price in USD:\n"
            "Example: `0.00001234` or `1.50`",
            parse_mode='Markdown'
        )
        context.user_data['alert_type'] = 'price_target'
        return WAITING_FOR_CUSTOM_PERCENT
    
    # Handle percentage alerts
    if callback_data.startswith("alert_"):
        parts = callback_data.split("_")
        
        if parts[1] == "any":
            # Any change alert (both up and down)
            percent = int(parts[2])
            await create_alert(query, context, user_id, percent, "any")
        elif parts[1] == "up":
            percent = int(parts[2])
            await create_alert(query, context, user_id, percent, "up")
        elif parts[1] == "down":
            percent = int(parts[2])
            await create_alert(query, context, user_id, percent, "down")
    
    return ConversationHandler.END


async def create_alert(query, context, user_id: int, percent: float, direction: str) -> None:
    """Create a new price alert."""
    token_info = context.user_data.get('current_token')
    contract_address = context.user_data.get('contract_address')
    
    if not token_info:
        await query.edit_message_text("❌ Error: Token info not found. Please try again.")
        return
    
    current_price = float(token_info.get('priceUsd', 0))
    
    if direction == "up":
        target_price = current_price * (1 + percent / 100)
        direction_emoji = "📈"
        direction_text = f"UP {percent}%"
    elif direction == "down":
        target_price = current_price * (1 - percent / 100)
        direction_emoji = "📉"
        direction_text = f"DOWN {percent}%"
    else:  # any
        target_price = percent  # For "any" alerts, we store the percentage threshold
        direction_emoji = "🔔"
        direction_text = f"±{percent}%"
    
    # Save alert to database
    alert_data = {
        'user_id': user_id,
        'contract_address': contract_address,
        'token_name': token_info.get('name'),
        'token_symbol': token_info.get('symbol'),
        'chain': token_info.get('chain'),
        'pair_address': token_info.get('pairAddress'),
        'initial_price': current_price,
        'target_price': target_price,
        'direction': direction,
        'percent': percent,
        'created_at': datetime.now().isoformat(),
        'active': True
    }
    
    alert_id = db.add_alert(alert_data)
    
    await query.edit_message_text(
        f"✅ *Alert Created Successfully!*\n\n"
        f"🪙 *Token:* {token_info.get('name')} (${token_info.get('symbol')})\n"
        f"💰 *Current Price:* ${format_number(current_price)}\n"
        f"{direction_emoji} *Alert:* {direction_text}\n"
        f"🎯 *Target Price:* ${format_number(target_price)}\n"
        f"🆔 *Alert ID:* `{alert_id}`\n\n"
        f"I'll notify you when the target is reached! 🔔",
        parse_mode='Markdown'
    )


async def handle_custom_percent(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Handle custom percentage input."""
    user_id = update.effective_user.id
    text = update.message.text.strip()
    
    alert_type = context.user_data.get('alert_type')
    
    if alert_type == 'price_target':
        # Handle price target
        try:
            target_price = float(text)
            token_info = context.user_data.get('current_token')
            contract_address = context.user_data.get('contract_address')
            current_price = float(token_info.get('priceUsd', 0))
            
            if target_price > current_price:
                direction = "up"
                percent = ((target_price - current_price) / current_price) * 100
            else:
                direction = "down"
                percent = ((current_price - target_price) / current_price) * 100
            
            alert_data = {
                'user_id': user_id,
                'contract_address': contract_address,
                'token_name': token_info.get('name'),
                'token_symbol': token_info.get('symbol'),
                'chain': token_info.get('chain'),
                'pair_address': token_info.get('pairAddress'),
                'initial_price': current_price,
                'target_price': target_price,
                'direction': direction,
                'percent': percent,
                'created_at': datetime.now().isoformat(),
                'active': True
            }
            
            alert_id = db.add_alert(alert_data)
            
            direction_emoji = "📈" if direction == "up" else "📉"
            
            await update.message.reply_text(
                f"✅ *Price Target Alert Created!*\n\n"
                f"🪙 *Token:* {token_info.get('name')} (${token_info.get('symbol')})\n"
                f"💰 *Current Price:* ${format_number(current_price)}\n"
                f"🎯 *Target Price:* ${format_number(target_price)}\n"
                f"{direction_emoji} *Change Required:* {percent:+.2f}%\n"
                f"🆔 *Alert ID:* `{alert_id}`\n\n"
                f"I'll notify you when the target is reached! 🔔",
                parse_mode='Markdown'
            )
            
        except ValueError:
            await update.message.reply_text(
                "❌ Invalid price. Please enter a valid number (e.g., `0.00001234`)",
                parse_mode='Markdown'
            )
            return WAITING_FOR_CUSTOM_PERCENT
    else:
        # Handle custom percentage
        try:
            percent = float(text)
            
            if percent == 0:
                await update.message.reply_text("❌ Percentage cannot be zero. Please try again.")
                return WAITING_FOR_CUSTOM_PERCENT
            
            direction = "up" if percent > 0 else "down"
            percent = abs(percent)
            
            # Create the alert
            token_info = context.user_data.get('current_token')
            contract_address = context.user_data.get('contract_address')
            current_price = float(token_info.get('priceUsd', 0))
            
            if direction == "up":
                target_price = current_price * (1 + percent / 100)
            else:
                target_price = current_price * (1 - percent / 100)
            
            alert_data = {
                'user_id': user_id,
                'contract_address': contract_address,
                'token_name': token_info.get('name'),
                'token_symbol': token_info.get('symbol'),
                'chain': token_info.get('chain'),
                'pair_address': token_info.get('pairAddress'),
                'initial_price': current_price,
                'target_price': target_price,
                'direction': direction,
                'percent': percent,
                'created_at': datetime.now().isoformat(),
                'active': True
            }
            
            alert_id = db.add_alert(alert_data)
            
            direction_emoji = "📈" if direction == "up" else "📉"
            direction_text = f"UP {percent}%" if direction == "up" else f"DOWN {percent}%"
            
            await update.message.reply_text(
                f"✅ *Custom Alert Created!*\n\n"
                f"🪙 *Token:* {token_info.get('name')} (${token_info.get('symbol')})\n"
                f"💰 *Current Price:* ${format_number(current_price)}\n"
                f"{direction_emoji} *Alert:* {direction_text}\n"
                f"🎯 *Target Price:* ${format_number(target_price)}\n"
                f"🆔 *Alert ID:* `{alert_id}`\n\n"
                f"I'll notify you when the target is reached! 🔔",
                parse_mode='Markdown'
            )
            
        except ValueError:
            await update.message.reply_text(
                "❌ Invalid percentage. Please enter a number (e.g., `25` or `-15`)",
                parse_mode='Markdown'
            )
            return WAITING_FOR_CUSTOM_PERCENT
    
    context.user_data['alert_type'] = None
    return ConversationHandler.END


async def view_alerts(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """View all active alerts for the user."""
    user_id = update.effective_user.id
    alerts = db.get_user_alerts(user_id)
    
    if not alerts:
        await update.message.reply_text(
            "📭 You don't have any active alerts.\n"
            "Send me a contract address to create one!"
        )
        return
    
    message = "🔔 *Your Active Alerts:*\n\n"
    
    for i, alert in enumerate(alerts, 1):
        direction_emoji = "📈" if alert['direction'] == "up" else "📉"
        message += (
            f"*{i}. {alert['token_name']}* (${alert['token_symbol']})\n"
            f"   {direction_emoji} {alert['direction'].upper()} {alert['percent']:.1f}%\n"
            f"   💰 Entry: ${format_number(alert['initial_price'])}\n"
            f"   🎯 Target: ${format_number(alert['target_price'])}\n"
            f"   🆔 ID: `{alert['id']}`\n\n"
        )
    
    # Add delete instructions
    message += "_Use /delete <alert_id> to remove an alert_"
    
    await update.message.reply_text(message, parse_mode='Markdown')


async def delete_alert(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Delete a specific alert."""
    user_id = update.effective_user.id
    
    if not context.args:
        # Show alerts with delete buttons
        alerts = db.get_user_alerts(user_id)
        
        if not alerts:
            await update.message.reply_text("📭 You don't have any alerts to delete.")
            return
        
        keyboard = []
        for alert in alerts:
            keyboard.append([
                InlineKeyboardButton(
                    f"🗑️ {alert['token_symbol']} - {alert['direction'].upper()} {alert['percent']:.0f}%",
                    callback_data=f"delete_{alert['id']}"
                )
            ])
        keyboard.append([InlineKeyboardButton("❌ Cancel", callback_data="cancel_delete")])
        
        reply_markup = InlineKeyboardMarkup(keyboard)
        await update.message.reply_text(
            "🗑️ *Select an alert to delete:*",
            parse_mode='Markdown',
            reply_markup=reply_markup
        )
    else:
        # Delete specific alert by ID
        alert_id = context.args[0]
        success = db.delete_alert(user_id, alert_id)
        
        if success:
            await update.message.reply_text(f"✅ Alert `{alert_id}` deleted successfully!", parse_mode='Markdown')
        else:
            await update.message.reply_text(f"❌ Alert `{alert_id}` not found or already deleted.", parse_mode='Markdown')


async def delete_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle delete button callbacks."""
    query = update.callback_query
    await query.answer()
    
    if query.data == "cancel_delete":
        await query.edit_message_text("❌ Delete operation cancelled.")
        return
    
    if query.data.startswith("delete_"):
        alert_id = query.data.replace("delete_", "")
        user_id = update.effective_user.id
        success = db.delete_alert(user_id, alert_id)
        
        if success:
            await query.edit_message_text(f"✅ Alert deleted successfully!")
        else:
            await query.edit_message_text(f"❌ Failed to delete alert.")


async def portfolio(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """View user's watchlist/portfolio."""
    user_id = update.effective_user.id
    watchlist = db.get_watchlist(user_id)
    
    if not watchlist:
        await update.message.reply_text(
            "📭 Your watchlist is empty.\n"
            "Track a token and add it to your watchlist!"
        )
        return
    
    message = "📊 *Your Watchlist:*\n\n"
    
    for i, token in enumerate(watchlist, 1):
        # Fetch current price
        current_info = await price_monitor.get_token_info(token['contract_address'])
        
        if current_info:
            current_price = float(current_info.get('priceUsd', 0))
            initial_price = float(token.get('initial_price', current_price))
            
            if initial_price > 0:
                change = ((current_price - initial_price) / initial_price) * 100
                change_emoji = "📈" if change >= 0 else "📉"
            else:
                change = 0
                change_emoji = "➖"
            
            message += (
                f"*{i}. {token['name']}* (${token['symbol']})\n"
                f"   💰 Price: ${format_number(current_price)}\n"
                f"   {change_emoji} Change: {change:+.2f}%\n"
                f"   🔗 Chain: {token.get('chain', 'Unknown').upper()}\n\n"
            )
        else:
            message += (
                f"*{i}. {token['name']}* (${token['symbol']})\n"
                f"   ⚠️ Unable to fetch current price\n\n"
            )
    
    await update.message.reply_text(message, parse_mode='Markdown')


async def stats(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """View user's alert statistics."""
    user_id = update.effective_user.id
    user_stats = db.get_user_stats(user_id)
    
    message = f"""
📊 *Your Statistics:*

🔔 Active Alerts: {user_stats['active_alerts']}
✅ Triggered Alerts: {user_stats['triggered_alerts']}
👀 Tokens Watching: {user_stats['watchlist_count']}
📅 Member Since: {user_stats['member_since']}

Keep tracking! 🚀
    """
    
    await update.message.reply_text(message, parse_mode='Markdown')


def is_valid_contract_address(address: str) -> bool:
    """Check if string looks like a valid contract address."""
    # EVM addresses (Ethereum, BSC, Polygon, etc.)
    if address.startswith('0x') and len(address) == 42:
        return all(c in '0123456789abcdefABCDEF' for c in address[2:])
    
    # Solana addresses (base58, 32-44 characters)
    if 32 <= len(address) <= 44:
        base58_chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
        return all(c in base58_chars for c in address)
    
    return False


def format_number(num) -> str:
    """Format number for display."""
    try:
        num = float(num)
        if num >= 1_000_000_000:
            return f"{num/1_000_000_000:.2f}B"
        elif num >= 1_000_000:
            return f"{num/1_000_000:.2f}M"
        elif num >= 1_000:
            return f"{num/1_000:.2f}K"
        elif num >= 1:
            return f"{num:.4f}"
        elif num >= 0.0001:
            return f"{num:.6f}"
        else:
            return f"{num:.10f}"
    except (ValueError, TypeError):
        return str(num)


async def error_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle errors."""
    logger.error(f"Exception while handling an update: {context.error}")
    
    if update and update.effective_message:
        await update.effective_message.reply_text(
            "❌ An error occurred. Please try again later."
        )


async def run_price_monitor(application: Application) -> None:
    """Background task to monitor prices and send alerts."""
    while True:
        try:
            triggered_alerts = await price_monitor.check_alerts()
            
            for alert in triggered_alerts:
                try:
                    direction_emoji = "📈" if alert['direction'] == "up" else "📉"
                    
                    message = (
                        f"🚨 *PRICE ALERT TRIGGERED!* 🚨\n\n"
                        f"🪙 *{alert['token_name']}* (${alert['token_symbol']})\n\n"
                        f"💰 *Current Price:* ${format_number(alert['current_price'])}\n"
                        f"📍 *Entry Price:* ${format_number(alert['initial_price'])}\n"
                        f"{direction_emoji} *Change:* {alert['actual_change']:+.2f}%\n"
                        f"🎯 *Target:* {alert['direction'].upper()} {alert['percent']:.1f}%\n\n"
                        f"_Alert has been removed. Set a new one if needed!_"
                    )
                    
                    await application.bot.send_message(
                        chat_id=alert['user_id'],
                        text=message,
                        parse_mode='Markdown'
                    )
                    
                    # Mark alert as triggered
                    db.mark_alert_triggered(alert['id'])
                    
                except Exception as e:
                    logger.error(f"Error sending alert to user {alert['user_id']}: {e}")
            
        except Exception as e:
            logger.error(f"Error in price monitor: {e}")
        
        # Check every 30 seconds
        await asyncio.sleep(30)


def main() -> None:
    """Start the bot."""
    # Create application
    application = Application.builder().token(BOT_TOKEN).build()
    
    # Conversation handler for tracking tokens
    conv_handler = ConversationHandler(
        entry_points=[
            CommandHandler("track", track_command),
            MessageHandler(filters.TEXT & ~filters.COMMAND, handle_contract_address),
        ],
        states={
            WAITING_FOR_CA: [
                CallbackQueryHandler(button_callback),
                MessageHandler(filters.TEXT & ~filters.COMMAND, handle_contract_address),
            ],
            WAITING_FOR_CUSTOM_PERCENT: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, handle_custom_percent),
            ],
        },
        fallbacks=[CommandHandler("start", start)],
    )
    
    # Add handlers
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("alerts", view_alerts))
    application.add_handler(CommandHandler("delete", delete_alert))
    application.add_handler(CommandHandler("portfolio", portfolio))
    application.add_handler(CommandHandler("stats", stats))
    application.add_handler(conv_handler)
    application.add_handler(CallbackQueryHandler(delete_callback, pattern="^delete_|^cancel_delete$"))
    
    # Add error handler
    application.add_error_handler(error_handler)
    
    # Start the price monitor as a background task
    async def post_init(application: Application) -> None:
        asyncio.create_task(run_price_monitor(application))
    
    application.post_init = post_init
    
    # Start the bot
    logger.info("🚀 Bot starting...")
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == '__main__':
    main()
