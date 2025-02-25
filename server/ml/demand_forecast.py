import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler

class DemandForecaster:
    def __init__(self):
        self.model = RandomForestRegressor()
        self.scaler = StandardScaler()
        
    def preprocess_data(self, historical_data):
        # Convert timestamps to features
        df = pd.DataFrame(historical_data)
        df['date'] = pd.to_datetime(df['date'])
        df['month'] = df['date'].dt.month
        df['day_of_week'] = df['date'].dt.dayofweek
        df['season'] = df['date'].dt.month % 12 // 3
        
        # Add lag features
        df['demand_lag_7'] = df['quantity'].shift(7)
        df['demand_lag_30'] = df['quantity'].shift(30)
        
        return df.dropna()

    def train(self, historical_data):
        df = self.preprocess_data(historical_data)
        
        X = df[['month', 'day_of_week', 'season', 'demand_lag_7', 'demand_lag_30']]
        y = df['quantity']
        
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, y)

    def predict(self, future_dates):
        # Prepare future dates features
        future_df = pd.DataFrame({'date': future_dates})
        future_df['month'] = future_df['date'].dt.month
        future_df['day_of_week'] = future_df['date'].dt.dayofweek
        future_df['season'] = future_df['date'].dt.month % 12 // 3
        
        X_future = self.scaler.transform(future_df[['month', 'day_of_week', 'season']])
        return self.model.predict(X_future) 