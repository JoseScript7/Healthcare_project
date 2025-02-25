from flask import Blueprint, request, jsonify
from .ml import DemandForecaster, StockOptimizer, ExpiryRiskAssessor

ml_routes = Blueprint('ml', __name__)

forecaster = DemandForecaster()
optimizer = StockOptimizer()
risk_assessor = ExpiryRiskAssessor()

@ml_routes.route('/forecast', methods=['POST'])
def get_demand_forecast():
    data = request.get_json()
    historical_data = data['historical_data']
    future_dates = data['future_dates']
    
    forecaster.train(historical_data)
    predictions = forecaster.predict(future_dates)
    
    return jsonify({
        'forecast': predictions.tolist()
    })

@ml_routes.route('/optimize', methods=['POST'])
def optimize_stock():
    data = request.get_json()
    forecast = data['forecast']
    lead_time = data['lead_time']
    
    optimization = optimizer.calculate_optimal_stock(
        forecast, 
        lead_time,
        service_level=data.get('service_level', 0.95)
    )
    
    return jsonify(optimization)

@ml_routes.route('/assess-risk', methods=['POST'])
def assess_expiry_risk():
    data = request.get_json()
    inventory = data['inventory']
    
    risk_assessment = risk_assessor.assess_risk(inventory)
    return jsonify({
        'risk_assessment': risk_assessment
    }) 