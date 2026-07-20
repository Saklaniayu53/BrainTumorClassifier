import os
import numpy as np
import tensorflow as tf

from flask import Flask, render_template, request, jsonify
from werkzeug.utils import secure_filename

from utils.preprocessing import preprocess_image

# ==========================================================
# Create Flask App
# ==========================================================

app = Flask(__name__)

# ==========================================================
# Configuration
# ==========================================================

UPLOAD_FOLDER = "static/uploads"
MODEL_PATH = "model/efficientnet_stage1_final.keras"

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ==========================================================
# Load Model
# ==========================================================

model = tf.keras.models.load_model(MODEL_PATH)

print("✅ Model Loaded Successfully")

# ==========================================================
# Class Names
# ==========================================================

CLASS_NAMES = [
    "Glioma",
    "Meningioma",
    "No Tumor",
    "Pituitary"
]

# ==========================================================
# Home Page
# ==========================================================

@app.route("/")
def home():

    return render_template("index.html")

# ==========================================================
# Prediction API
# ==========================================================

@app.route("/predict", methods=["POST"])
def predict():

    if "image" not in request.files:

        return jsonify({

            "success": False,
            "message": "No image uploaded."

        })

    image = request.files["image"]

    if image.filename == "":

        return jsonify({

            "success": False,
            "message": "No image selected."

        })

    filename = secure_filename(image.filename)

    filepath = os.path.join(

        app.config["UPLOAD_FOLDER"],
        filename

    )

    image.save(filepath)

    processed_image = preprocess_image(filepath)

    prediction = model.predict(processed_image, verbose=0)

    predicted_index = int(np.argmax(prediction))

    predicted_class = CLASS_NAMES[predicted_index]

    confidence = float(np.max(prediction) * 100)

    return jsonify({

        "success": True,

        "prediction": predicted_class,

        "confidence": round(confidence, 2),

        "image": f"/static/uploads/{filename}"

    })

# ==========================================================
# Run
# ==========================================================

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)