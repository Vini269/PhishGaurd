class PhishingDetector:
    def __init__(self, model, threshold=0.95):
        self.model = model
        self.threshold = threshold

    def predict(self, X):
        probabilities = self.model.predict_proba(X)
        predictions = self.model.predict(X)

        confidence = probabilities.max(axis=1)
        predictions[confidence < self.threshold] = 1

        return predictions

    def predict_proba(self, X):
        return self.model.predict_proba(X)

    def predict_with_confidence(self, X):
        probabilities = self.model.predict_proba(X)
        predictions = self.model.predict(X)
        confidence = probabilities.max(axis=1)

        predictions[confidence < self.threshold] = 1

        return predictions, confidence