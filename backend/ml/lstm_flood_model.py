"""
LSTM Flood Prediction Model
===========================
Time-series deep learning model for river level forecasting.
"""

import os
import json
import numpy as np
from typing import Tuple, Dict, Optional, List
from datetime import datetime

# ----------------- Optional Dependencies -----------------

try:
    import tensorflow as tf
    from tensorflow import keras
    from tensorflow.keras import layers
    from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
    TF_AVAILABLE = True
except ImportError:
    TF_AVAILABLE = False
    print("⚠️ TensorFlow not available. Using simulation mode.")

try:
    from sklearn.preprocessing import MinMaxScaler
    import joblib
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False

# ----------------- LSTM Core Model -----------------

class LSTMFloodModel:
    def __init__(
        self,
        sequence_length: int = 7,
        n_features: int = 2,
        lstm_units: List[int] = [64, 32],
        dropout_rate: float = 0.2,
        model_path: Optional[str] = None
    ):
        self.sequence_length = sequence_length
        self.n_features = n_features
        self.lstm_units = lstm_units
        self.dropout_rate = dropout_rate

        self.model = None
        self.scaler = MinMaxScaler() if SKLEARN_AVAILABLE else None
        self.is_trained = False
        self.training_history = None
        self.model_metadata: Dict = {}

        if model_path and os.path.exists(model_path):
            self.load_model(model_path)
        elif TF_AVAILABLE:
            self._build_model()

    # ---------- Model Building ----------

    def _build_model(self) -> None:
        if not TF_AVAILABLE:
            return

        model = keras.Sequential()
        model.add(layers.Input(shape=(self.sequence_length, self.n_features)))

        for i, units in enumerate(self.lstm_units):
            model.add(layers.LSTM(
                units,
                return_sequences=i < len(self.lstm_units) - 1,
                kernel_regularizer=keras.regularizers.l2(0.01)
            ))
            model.add(layers.Dropout(self.dropout_rate))
            model.add(layers.BatchNormalization())

        model.add(layers.Dense(16, activation="relu"))
        model.add(layers.Dropout(self.dropout_rate / 2))
        model.add(layers.Dense(1, activation="linear"))

        model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=0.001),
            loss="mse",
            metrics=["mae"]
        )

        self.model = model
        print("✅ LSTM model initialized")

    # ---------- Data Preparation ----------

    def prepare_sequences(
        self,
        rainfall: np.ndarray,
        river_level: np.ndarray,
        fit_scaler: bool = True
    ) -> Tuple[np.ndarray, np.ndarray]:

        features = np.column_stack([rainfall, river_level])

        if self.scaler:
            features = self.scaler.fit_transform(features) if fit_scaler else self.scaler.transform(features)

        X, y = [], []
        for i in range(self.sequence_length, len(features) - 1):
            X.append(features[i - self.sequence_length:i])
            y.append(features[i + 1, 1])

        return np.array(X), np.array(y)

    # ---------- Training ----------

    def train(
        self,
        X_train: np.ndarray,
        y_train: np.ndarray,
        X_val: Optional[np.ndarray] = None,
        y_val: Optional[np.ndarray] = None,
        epochs: int = 100,
        batch_size: int = 32,
        model_save_path: Optional[str] = None,
        verbose: int = 1
    ) -> Dict:

        if not TF_AVAILABLE or self.model is None:
            return self._simulate_training()

        if X_val is None:
            split = int(len(X_train) * 0.9)
            X_val, y_val = X_train[split:], y_train[split:]
            X_train, y_train = X_train[:split], y_train[:split]

        callbacks = [
            EarlyStopping(monitor="val_loss", patience=15, restore_best_weights=True),
            ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=5, min_lr=1e-6),
        ]

        if model_save_path:
            os.makedirs(os.path.dirname(model_save_path), exist_ok=True)
            callbacks.append(ModelCheckpoint(model_save_path, save_best_only=True))

        history = self.model.fit(
            X_train, y_train,
            validation_data=(X_val, y_val),
            epochs=epochs,
            batch_size=batch_size,
            callbacks=callbacks,
            verbose=verbose
        )

        self.is_trained = True
        self.training_history = history.history

        train_metrics = self.model.evaluate(X_train, y_train, verbose=0)
        val_metrics = self.model.evaluate(X_val, y_val, verbose=0)

        self.model_metadata = {
            "trained_at": datetime.now().isoformat(),
            "epochs": len(history.history["loss"]),
            "train_loss": float(train_metrics[0]),
            "train_mae": float(train_metrics[1]),
            "val_loss": float(val_metrics[0]),
            "val_mae": float(val_metrics[1]),
            "sequence_length": self.sequence_length,
            "lstm_units": self.lstm_units
        }

        return self.training_history

    def _simulate_training(self) -> Dict:
        self.is_trained = True
        self.model_metadata = {
            "trained_at": datetime.now().isoformat(),
            "mode": "simulated",
            "mae": 2.5
        }
        return {"loss": [0.1], "val_loss": [0.12]}

    # ---------- Prediction ----------

    def predict(self, X: np.ndarray, return_confidence: bool = True):
        if not TF_AVAILABLE or self.model is None:
            return self._simulate_prediction(X)

        preds_scaled = self.model.predict(X, verbose=0)

        if self.scaler:
            dummy = np.zeros((len(preds_scaled), 2))
            dummy[:, 1] = preds_scaled.flatten()
            preds = self.scaler.inverse_transform(dummy)[:, 1]
        else:
            preds = preds_scaled.flatten()

        confidence = self._calculate_confidence(X) if return_confidence else None
        return preds, confidence

    def _simulate_prediction(self, X: np.ndarray):
        last = X[:, -1, 1]
        preds = last * (1 + np.random.normal(0, 0.05, size=len(last)))
        confidence = np.ones_like(preds) * 0.75
        return preds, confidence

    def _calculate_confidence(self, X: np.ndarray, n_samples: int = 10) -> np.ndarray:
        preds = [self.model(X, training=True).numpy() for _ in range(n_samples)]
        variance = np.var(preds, axis=0).flatten()
        confidence = 1 / (1 + variance)
        return np.clip(confidence, 0.5, 0.95)

    # ---------- Persistence ----------

    def save_model(self, path: str):
        os.makedirs(os.path.dirname(path) if os.path.dirname(path) else ".", exist_ok=True)

        if TF_AVAILABLE and self.model:
            self.model.save(path)

        if self.scaler:
            joblib.dump(self.scaler, path.replace(".h5", "_scaler.joblib"))

        with open(path.replace(".h5", "_metadata.json"), "w") as f:
            json.dump(self.model_metadata, f, indent=2)

    def load_model(self, path: str):
        if TF_AVAILABLE and os.path.exists(path):
            self.model = keras.models.load_model(path)
            self.is_trained = True

        scaler_path = path.replace(".h5", "_scaler.joblib")
        if os.path.exists(scaler_path):
            self.scaler = joblib.load(scaler_path)

        meta_path = path.replace(".h5", "_metadata.json")
        if os.path.exists(meta_path):
            with open(meta_path, "r") as f:
                self.model_metadata = json.load(f)
