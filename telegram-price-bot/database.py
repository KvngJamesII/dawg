import json
import os
import uuid
import logging
from datetime import datetime
from typing import Dict, List, Optional, Any
from threading import Lock

logger = logging.getLogger(__name__)

# Data directory
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')


class Database:
    """Simple JSON-based database for storing alerts and user data."""
    
    def __init__(self):
        self.data_dir = DATA_DIR
        self.alerts_file = os.path.join(self.data_dir, 'alerts.json')
        self.users_file = os.path.join(self.data_dir, 'users.json')
        self.watchlist_file = os.path.join(self.data_dir, 'watchlist.json')
        
        # Thread safety
        self.lock = Lock()
        
        # Ensure data directory exists
        os.makedirs(self.data_dir, exist_ok=True)
        
        # Initialize data files
        self._init_files()
    
    def _init_files(self):
        """Initialize data files if they don't exist."""
        for file_path in [self.alerts_file, self.users_file, self.watchlist_file]:
            if not os.path.exists(file_path):
                self._save_json(file_path, {})
    
    def _load_json(self, file_path: str) -> Dict:
        """Load JSON data from file."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return {}
    
    def _save_json(self, file_path: str, data: Dict) -> None:
        """Save data to JSON file."""
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, default=str)
    
    # ==================== ALERTS ====================
    
    def add_alert(self, alert_data: Dict[str, Any]) -> str:
        """
        Add a new price alert.
        
        Args:
            alert_data: Alert data dictionary
            
        Returns:
            Alert ID
        """
        with self.lock:
            alerts = self._load_json(self.alerts_file)
            
            # Generate unique ID
            alert_id = str(uuid.uuid4())[:8]
            alert_data['id'] = alert_id
            alert_data['active'] = True
            alert_data['triggered'] = False
            
            user_id = str(alert_data['user_id'])
            
            if user_id not in alerts:
                alerts[user_id] = []
            
            alerts[user_id].append(alert_data)
            
            self._save_json(self.alerts_file, alerts)
            
            # Update user record
            self._ensure_user(alert_data['user_id'])
            
            logger.info(f"Alert {alert_id} created for user {user_id}")
            return alert_id
    
    def get_user_alerts(self, user_id: int, active_only: bool = True) -> List[Dict]:
        """
        Get all alerts for a user.
        
        Args:
            user_id: Telegram user ID
            active_only: Only return active alerts
            
        Returns:
            List of alert dictionaries
        """
        with self.lock:
            alerts = self._load_json(self.alerts_file)
            user_alerts = alerts.get(str(user_id), [])
            
            if active_only:
                return [a for a in user_alerts if a.get('active', True)]
            return user_alerts
    
    def get_all_active_alerts(self) -> List[Dict]:
        """Get all active alerts from all users."""
        with self.lock:
            alerts = self._load_json(self.alerts_file)
            active = []
            
            for user_id, user_alerts in alerts.items():
                for alert in user_alerts:
                    if alert.get('active', True):
                        active.append(alert)
            
            return active
    
    def get_alert_by_id(self, user_id: int, alert_id: str) -> Optional[Dict]:
        """Get a specific alert by ID."""
        with self.lock:
            alerts = self._load_json(self.alerts_file)
            user_alerts = alerts.get(str(user_id), [])
            
            for alert in user_alerts:
                if alert.get('id') == alert_id:
                    return alert
            return None
    
    def delete_alert(self, user_id: int, alert_id: str) -> bool:
        """
        Delete/deactivate an alert.
        
        Args:
            user_id: Telegram user ID
            alert_id: Alert ID to delete
            
        Returns:
            True if deleted, False if not found
        """
        with self.lock:
            alerts = self._load_json(self.alerts_file)
            user_id_str = str(user_id)
            
            if user_id_str not in alerts:
                return False
            
            user_alerts = alerts[user_id_str]
            
            for i, alert in enumerate(user_alerts):
                if alert.get('id') == alert_id:
                    user_alerts.pop(i)
                    alerts[user_id_str] = user_alerts
                    self._save_json(self.alerts_file, alerts)
                    logger.info(f"Alert {alert_id} deleted for user {user_id}")
                    return True
            
            return False
    
    def mark_alert_triggered(self, alert_id: str) -> bool:
        """
        Mark an alert as triggered and deactivate it.
        
        Args:
            alert_id: Alert ID
            
        Returns:
            True if updated, False if not found
        """
        with self.lock:
            alerts = self._load_json(self.alerts_file)
            
            for user_id, user_alerts in alerts.items():
                for alert in user_alerts:
                    if alert.get('id') == alert_id:
                        alert['active'] = False
                        alert['triggered'] = True
                        alert['triggered_at'] = datetime.now().isoformat()
                        self._save_json(self.alerts_file, alerts)
                        logger.info(f"Alert {alert_id} marked as triggered")
                        return True
            
            return False
    
    def clear_user_alerts(self, user_id: int) -> int:
        """
        Clear all alerts for a user.
        
        Args:
            user_id: Telegram user ID
            
        Returns:
            Number of alerts cleared
        """
        with self.lock:
            alerts = self._load_json(self.alerts_file)
            user_id_str = str(user_id)
            
            if user_id_str in alerts:
                count = len(alerts[user_id_str])
                alerts[user_id_str] = []
                self._save_json(self.alerts_file, alerts)
                return count
            return 0
    
    # ==================== WATCHLIST ====================
    
    def add_to_watchlist(self, user_id: int, token_info: Dict) -> bool:
        """
        Add a token to user's watchlist.
        
        Args:
            user_id: Telegram user ID
            token_info: Token information dictionary
            
        Returns:
            True if added, False if already exists
        """
        with self.lock:
            watchlist = self._load_json(self.watchlist_file)
            user_id_str = str(user_id)
            
            if user_id_str not in watchlist:
                watchlist[user_id_str] = []
            
            # Check if already in watchlist
            contract_address = token_info.get('address', '').lower()
            for token in watchlist[user_id_str]:
                if token.get('contract_address', '').lower() == contract_address:
                    return False
            
            # Add to watchlist
            watchlist_entry = {
                'contract_address': contract_address,
                'name': token_info.get('name'),
                'symbol': token_info.get('symbol'),
                'chain': token_info.get('chain'),
                'initial_price': token_info.get('priceUsd'),
                'added_at': datetime.now().isoformat()
            }
            
            watchlist[user_id_str].append(watchlist_entry)
            self._save_json(self.watchlist_file, watchlist)
            
            return True
    
    def get_watchlist(self, user_id: int) -> List[Dict]:
        """Get user's watchlist."""
        with self.lock:
            watchlist = self._load_json(self.watchlist_file)
            return watchlist.get(str(user_id), [])
    
    def remove_from_watchlist(self, user_id: int, contract_address: str) -> bool:
        """Remove a token from watchlist."""
        with self.lock:
            watchlist = self._load_json(self.watchlist_file)
            user_id_str = str(user_id)
            
            if user_id_str not in watchlist:
                return False
            
            initial_count = len(watchlist[user_id_str])
            watchlist[user_id_str] = [
                t for t in watchlist[user_id_str]
                if t.get('contract_address', '').lower() != contract_address.lower()
            ]
            
            if len(watchlist[user_id_str]) < initial_count:
                self._save_json(self.watchlist_file, watchlist)
                return True
            return False
    
    # ==================== USERS ====================
    
    def _ensure_user(self, user_id: int) -> None:
        """Ensure user exists in database."""
        users = self._load_json(self.users_file)
        user_id_str = str(user_id)
        
        if user_id_str not in users:
            users[user_id_str] = {
                'user_id': user_id,
                'created_at': datetime.now().isoformat(),
                'alerts_created': 0,
                'alerts_triggered': 0
            }
            self._save_json(self.users_file, users)
    
    def get_user(self, user_id: int) -> Optional[Dict]:
        """Get user data."""
        with self.lock:
            users = self._load_json(self.users_file)
            return users.get(str(user_id))
    
    def update_user(self, user_id: int, data: Dict) -> None:
        """Update user data."""
        with self.lock:
            users = self._load_json(self.users_file)
            user_id_str = str(user_id)
            
            if user_id_str not in users:
                users[user_id_str] = {}
            
            users[user_id_str].update(data)
            self._save_json(self.users_file, users)
    
    def get_user_stats(self, user_id: int) -> Dict:
        """Get user statistics."""
        with self.lock:
            user = self.get_user(user_id)
            alerts = self.get_user_alerts(user_id, active_only=False)
            watchlist = self.get_watchlist(user_id)
            
            active_alerts = len([a for a in alerts if a.get('active', True)])
            triggered_alerts = len([a for a in alerts if a.get('triggered', False)])
            
            created_at = user.get('created_at', datetime.now().isoformat()) if user else datetime.now().isoformat()
            
            try:
                member_since = datetime.fromisoformat(created_at).strftime('%Y-%m-%d')
            except:
                member_since = 'Unknown'
            
            return {
                'active_alerts': active_alerts,
                'triggered_alerts': triggered_alerts,
                'watchlist_count': len(watchlist),
                'member_since': member_since,
                'total_alerts_created': len(alerts)
            }
    
    def get_all_users(self) -> List[int]:
        """Get all user IDs."""
        with self.lock:
            users = self._load_json(self.users_file)
            return [int(uid) for uid in users.keys()]
