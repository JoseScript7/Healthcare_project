import numpy as np
from scipy.optimize import minimize

class StockOptimizer:
    def __init__(self, holding_cost=0.1, stockout_cost=0.5):
        self.holding_cost = holding_cost
        self.stockout_cost = stockout_cost
        
    def calculate_optimal_stock(self, demand_forecast, lead_time, service_level=0.95):
        """Calculate optimal stock levels using newsvendor model"""
        mean_demand = np.mean(demand_forecast)
        std_demand = np.std(demand_forecast)
        
        # Calculate safety stock factor based on service level
        z_score = np.percentile(np.random.normal(0, 1, 10000), service_level * 100)
        
        # Calculate optimal order quantity
        optimal_quantity = mean_demand * lead_time + z_score * std_demand * np.sqrt(lead_time)
        
        return {
            'optimal_quantity': optimal_quantity,
            'reorder_point': mean_demand * (lead_time/2) + z_score * std_demand * np.sqrt(lead_time),
            'safety_stock': z_score * std_demand * np.sqrt(lead_time)
        } 