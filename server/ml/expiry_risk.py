from sklearn.ensemble import GradientBoostingClassifier
import pandas as pd

class ExpiryRiskAssessor:
    def __init__(self):
        self.model = GradientBoostingClassifier()
        
    def preprocess_data(self, inventory_data):
        df = pd.DataFrame(inventory_data)
        
        # Calculate days until expiry
        df['days_until_expiry'] = (pd.to_datetime(df['expiry_date']) - pd.Timestamp.now()).dt.days
        
        # Calculate turnover rate
        df['turnover_rate'] = df['quantity_sold'] / df['initial_quantity']
        
        # Feature engineering
        features = [
            'days_until_expiry',
            'turnover_rate',
            'current_quantity',
            'average_daily_demand'
        ]
        
        return df[features]

    def train(self, historical_data, expired_flags):
        X = self.preprocess_data(historical_data)
        self.model.fit(X, expired_flags)
        
    def assess_risk(self, current_inventory):
        X = self.preprocess_data(current_inventory)
        risk_scores = self.model.predict_proba(X)[:, 1]  # Probability of expiry
        
        return [{
            'item_id': item['item_id'],
            'risk_score': score,
            'risk_level': 'high' if score > 0.7 else 'medium' if score > 0.3 else 'low'
        } for item, score in zip(current_inventory, risk_scores)] 