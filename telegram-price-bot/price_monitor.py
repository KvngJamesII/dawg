import aiohttp
import asyncio
import logging
from typing import Optional, Dict, List, Any
from datetime import datetime

logger = logging.getLogger(__name__)

DEXSCREENER_API_BASE = "https://api.dexscreener.com/latest"


class PriceMonitor:
    """Monitor cryptocurrency prices using DexScreener API."""
    
    def __init__(self, database):
        self.db = database
        self.session: Optional[aiohttp.ClientSession] = None
        self.price_cache: Dict[str, Dict] = {}
        self.cache_ttl = 30  # Cache TTL in seconds
    
    async def get_session(self) -> aiohttp.ClientSession:
        """Get or create aiohttp session."""
        if self.session is None or self.session.closed:
            self.session = aiohttp.ClientSession()
        return self.session
    
    async def close(self):
        """Close the aiohttp session."""
        if self.session and not self.session.closed:
            await self.session.close()
    
    async def get_token_info(self, contract_address: str) -> Optional[Dict[str, Any]]:
        """
        Fetch token information from DexScreener API.
        
        Args:
            contract_address: The token contract address
            
        Returns:
            Token information dict or None if not found
        """
        # Check cache first
        cache_key = contract_address.lower()
        if cache_key in self.price_cache:
            cached = self.price_cache[cache_key]
            if (datetime.now() - cached['timestamp']).seconds < self.cache_ttl:
                return cached['data']
        
        try:
            session = await self.get_session()
            
            # Try token search endpoint
            url = f"{DEXSCREENER_API_BASE}/dex/tokens/{contract_address}"
            
            async with session.get(url, timeout=aiohttp.ClientTimeout(total=15)) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    if data and 'pairs' in data and data['pairs']:
                        # Get the pair with highest liquidity
                        pairs = data['pairs']
                        best_pair = max(pairs, key=lambda x: float(x.get('liquidity', {}).get('usd', 0) or 0))
                        
                        token_info = self._parse_pair_data(best_pair, contract_address)
                        
                        # Cache the result
                        self.price_cache[cache_key] = {
                            'data': token_info,
                            'timestamp': datetime.now()
                        }
                        
                        return token_info
            
            # If not found by token, try searching by pair address
            url = f"{DEXSCREENER_API_BASE}/dex/pairs/search?q={contract_address}"
            
            async with session.get(url, timeout=aiohttp.ClientTimeout(total=15)) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    if data and 'pairs' in data and data['pairs']:
                        best_pair = data['pairs'][0]
                        token_info = self._parse_pair_data(best_pair, contract_address)
                        
                        self.price_cache[cache_key] = {
                            'data': token_info,
                            'timestamp': datetime.now()
                        }
                        
                        return token_info
            
            return None
            
        except asyncio.TimeoutError:
            logger.error(f"Timeout fetching token info for {contract_address}")
            return None
        except Exception as e:
            logger.error(f"Error fetching token info for {contract_address}: {e}")
            return None
    
    def _parse_pair_data(self, pair: Dict, contract_address: str) -> Dict[str, Any]:
        """Parse DexScreener pair data into a standardized format."""
        base_token = pair.get('baseToken', {})
        quote_token = pair.get('quoteToken', {})
        
        # Determine which token we're tracking
        if base_token.get('address', '').lower() == contract_address.lower():
            token = base_token
        else:
            token = base_token  # Default to base token
        
        price_change = pair.get('priceChange', {})
        liquidity = pair.get('liquidity', {})
        volume = pair.get('volume', {})
        
        return {
            'name': token.get('name', 'Unknown'),
            'symbol': token.get('symbol', 'N/A'),
            'address': token.get('address', contract_address),
            'priceUsd': pair.get('priceUsd', '0'),
            'priceNative': pair.get('priceNative', '0'),
            'priceChange5m': price_change.get('m5', 0),
            'priceChange1h': price_change.get('h1', 0),
            'priceChange6h': price_change.get('h6', 0),
            'priceChange24h': price_change.get('h24', 0),
            'liquidity': liquidity.get('usd', 0),
            'liquidityBase': liquidity.get('base', 0),
            'liquidityQuote': liquidity.get('quote', 0),
            'volume24h': volume.get('h24', 0),
            'volume6h': volume.get('h6', 0),
            'volume1h': volume.get('h1', 0),
            'txns24h': pair.get('txns', {}).get('h24', {}),
            'chain': pair.get('chainId', 'unknown'),
            'dex': pair.get('dexId', 'unknown'),
            'pairAddress': pair.get('pairAddress', ''),
            'quoteToken': {
                'name': quote_token.get('name', ''),
                'symbol': quote_token.get('symbol', ''),
                'address': quote_token.get('address', '')
            },
            'url': pair.get('url', ''),
            'fdv': pair.get('fdv', 0),
            'marketCap': pair.get('marketCap', 0),
        }
    
    async def get_current_price(self, contract_address: str) -> Optional[float]:
        """Get just the current price for a token."""
        token_info = await self.get_token_info(contract_address)
        if token_info:
            try:
                return float(token_info.get('priceUsd', 0))
            except (ValueError, TypeError):
                return None
        return None
    
    async def check_alerts(self) -> List[Dict]:
        """
        Check all active alerts and return triggered ones.
        
        Returns:
            List of triggered alert dictionaries
        """
        triggered = []
        active_alerts = self.db.get_all_active_alerts()
        
        # Group alerts by contract address to minimize API calls
        alerts_by_address: Dict[str, List[Dict]] = {}
        for alert in active_alerts:
            addr = alert['contract_address'].lower()
            if addr not in alerts_by_address:
                alerts_by_address[addr] = []
            alerts_by_address[addr].append(alert)
        
        # Check each unique token
        for contract_address, alerts in alerts_by_address.items():
            try:
                current_price = await self.get_current_price(contract_address)
                
                if current_price is None or current_price == 0:
                    continue
                
                for alert in alerts:
                    initial_price = float(alert['initial_price'])
                    target_price = float(alert['target_price'])
                    direction = alert['direction']
                    
                    if initial_price == 0:
                        continue
                    
                    # Calculate actual change
                    actual_change = ((current_price - initial_price) / initial_price) * 100
                    
                    is_triggered = False
                    
                    if direction == "up":
                        # Check if price went up by target percentage
                        if current_price >= target_price:
                            is_triggered = True
                    elif direction == "down":
                        # Check if price went down by target percentage
                        if current_price <= target_price:
                            is_triggered = True
                    elif direction == "any":
                        # Check if price changed by threshold in either direction
                        threshold = float(alert['percent'])
                        if abs(actual_change) >= threshold:
                            is_triggered = True
                    
                    if is_triggered:
                        alert['current_price'] = current_price
                        alert['actual_change'] = actual_change
                        triggered.append(alert)
                
            except Exception as e:
                logger.error(f"Error checking alerts for {contract_address}: {e}")
                continue
        
        return triggered
    
    async def get_multiple_prices(self, addresses: List[str]) -> Dict[str, Optional[float]]:
        """
        Get prices for multiple tokens.
        
        Args:
            addresses: List of contract addresses
            
        Returns:
            Dict mapping address to price (or None if not found)
        """
        results = {}
        
        # Process in batches to avoid rate limiting
        batch_size = 5
        for i in range(0, len(addresses), batch_size):
            batch = addresses[i:i + batch_size]
            
            tasks = [self.get_current_price(addr) for addr in batch]
            prices = await asyncio.gather(*tasks, return_exceptions=True)
            
            for addr, price in zip(batch, prices):
                if isinstance(price, Exception):
                    results[addr] = None
                else:
                    results[addr] = price
            
            # Small delay between batches
            if i + batch_size < len(addresses):
                await asyncio.sleep(0.5)
        
        return results
    
    async def search_tokens(self, query: str) -> List[Dict]:
        """
        Search for tokens by name or symbol.
        
        Args:
            query: Search query (token name or symbol)
            
        Returns:
            List of matching tokens
        """
        try:
            session = await self.get_session()
            url = f"{DEXSCREENER_API_BASE}/dex/search?q={query}"
            
            async with session.get(url, timeout=aiohttp.ClientTimeout(total=15)) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    if data and 'pairs' in data:
                        results = []
                        seen_tokens = set()
                        
                        for pair in data['pairs'][:20]:  # Limit to 20 results
                            base_token = pair.get('baseToken', {})
                            token_addr = base_token.get('address', '').lower()
                            
                            if token_addr and token_addr not in seen_tokens:
                                seen_tokens.add(token_addr)
                                results.append(self._parse_pair_data(pair, token_addr))
                        
                        return results
            
            return []
            
        except Exception as e:
            logger.error(f"Error searching tokens: {e}")
            return []
    
    async def get_trending_tokens(self, chain: str = None) -> List[Dict]:
        """
        Get trending tokens (by volume).
        
        Args:
            chain: Optional chain filter (e.g., 'ethereum', 'bsc', 'solana')
            
        Returns:
            List of trending tokens
        """
        try:
            session = await self.get_session()
            
            if chain:
                url = f"{DEXSCREENER_API_BASE}/dex/pairs/{chain}"
            else:
                # Search for popular tokens
                url = f"{DEXSCREENER_API_BASE}/dex/search?q=PEPE"  # Example trending search
            
            async with session.get(url, timeout=aiohttp.ClientTimeout(total=15)) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    if data and 'pairs' in data:
                        # Sort by volume
                        pairs = sorted(
                            data['pairs'],
                            key=lambda x: float(x.get('volume', {}).get('h24', 0) or 0),
                            reverse=True
                        )[:10]
                        
                        return [self._parse_pair_data(p, p.get('baseToken', {}).get('address', '')) for p in pairs]
            
            return []
            
        except Exception as e:
            logger.error(f"Error fetching trending tokens: {e}")
            return []
