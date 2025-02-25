from flask import Flask, request, jsonify
from demand_forecast import DemandForecaster
from stock_optimizer import StockOptimizer
from expiry_risk import ExpiryRiskAssessor

app = Flask(__name__)

forecaster = DemandForecaster()
optimizer = StockOptimizer()
risk_assessor = ExpiryRiskAssessor()

@app.route('/api/ml/forecast', methods=['POST'])
def forecast():
    try:
        data = request.get_json()
        predictions = forecaster.predict(data['future_dates'])
        return jsonify({'forecast': predictions.tolist()})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/ml/optimize', methods=['POST'])
def optimize():
    try:
        data = request.get_json()
        result = optimizer.calculate_optimal_stock(
            data['forecast'],
            data['lead_time'],
            data.get('service_level', 0.95)
        )
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/ml/risk', methods=['POST'])
def assess_risk():
    try:
        data = request.get_json()
        assessment = risk_assessor.assess_risk(data['inventory'])
        return jsonify({'risk_assessment': assessment})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001)  # Run on different port than Node.js 