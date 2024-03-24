from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import logging
from risk_prediction import predict_risk, predict_action

app = Flask(__name__)
CORS(app)


logging.basicConfig(level=logging.DEBUG)

@app.route('/predict_risk', methods=['POST'])
def predict_risk_route():
    try:

        input_data = request.get_json()

        app.logger.info(f"Received data for risk prediction: {input_data}")

        input_df = pd.DataFrame([input_data])
        # app.logger.info(f"DataFrame shape: {input_df.shape}")

        risk_prediction = predict_risk(input_df)
        return jsonify({'risk_prediction': risk_prediction})
    except Exception as e:
        app.logger.error(f"An error occurred during risk prediction: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/predict_action', methods=['POST'])
def predict_action_route():
    try:

        input_data = request.get_json()

        app.logger.info(f"Received data for action prediction: {input_data}")

        input_df = pd.DataFrame([input_data])
        app.logger.info(f"DataFrame shape: {input_df.shape}")

        action_prediction = predict_action(input_df)
        return jsonify({'action_prediction': action_prediction})
    except Exception as e:
        app.logger.error(f"An error occurred during action prediction: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
