import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier
from sklearn.multioutput import MultiOutputClassifier
from sklearn.metrics import accuracy_score
from joblib import dump, load
import logging
import numpy as np

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

df = pd.read_csv('Dataset_for_AI.csv')

features = ['Age', 'Gender', 'Hypertension', 'Hyperlipidemia', 'Diabetes', 'Smoking']
target_risk = 'NCD_Risk'
target_action = 'Action'


y_risk = df[target_risk].str.get_dummies(sep=', ')

y_action, _ = pd.factorize(df[target_action])


X = df[features]

X_train_risk, X_test_risk, y_train_risk, y_test_risk = train_test_split(
    X, y_risk, test_size=0.2, random_state=42
)
X_train_action, X_test_action, y_train_action, y_test_action = train_test_split(
    X, y_action, test_size=0.2, random_state=42
)

numeric_features = ['Age']
numeric_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

categorical_features = ['Gender', 'Hypertension', 'Hyperlipidemia', 'Diabetes', 'Smoking']
categorical_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('onehot', OneHotEncoder(handle_unknown='ignore'))
])

preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features),
        ('cat', categorical_transformer, categorical_features)
    ]
)

pipeline_risk = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', MultiOutputClassifier(RandomForestClassifier(random_state=42)))
])

pipeline_action = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(random_state=42))
])


pipeline_risk.fit(X_train_risk, y_train_risk)
pipeline_action.fit(X_train_action, y_train_action)


dump(pipeline_risk, 'risk_model.joblib')
dump(pipeline_action, 'action_model.joblib')


risk_predictions = pipeline_risk.predict(X_test_risk)
risk_accuracy = accuracy_score(y_test_risk, risk_predictions)
logger.info(f"Risk Prediction Model Accuracy: {risk_accuracy}")


action_predictions = pipeline_action.predict(X_test_action)
action_accuracy = accuracy_score(y_test_action, action_predictions)
logger.info(f"Action Prediction Model Accuracy: {action_accuracy}")

def predict_risk(input_features, threshold=0.3):
    try:
        risk_model = load('risk_model.joblib')
        input_df = pd.DataFrame(input_features, columns=features)
        predicted_probabilities = risk_model.predict_proba(input_df)
        probabilities = np.array([prob[:, 1] for prob in predicted_probabilities]).T
        binarized_predictions = (probabilities >= threshold).astype(int)
        predicted_labels = y_risk.columns[binarized_predictions[0] == 1].tolist()
        return ', '.join(predicted_labels)
    except Exception as e:
        logger.error(f"An error occurred during risk prediction: {e}", exc_info=True)
        raise


def predict_action(input_features):
    try:
        action_model = load('action_model.joblib')
        input_df = pd.DataFrame(input_features, columns=features)
        prediction = action_model.predict(input_df)
        predicted_label = df[target_action].unique()[prediction[0]]
        return predicted_label
    except Exception as e:
        logger.error("An error occurred during action prediction", exc_info=True)
        raise
