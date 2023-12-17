import os
import pathlib
import io
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import tensorflow as tf
from tensorflow import keras
from PIL import Image
from flask import Flask, request, jsonify

model = keras.models.load_model("batik_model.h5")
label = ['Batik Lasem', 'Batik Parang', 'Batik Pati', 'Batik Pekalongan', 'Batik Sekar Jagad', 'Batik Sidoluhur', 'Batik Sogan', 'Batik Truntum']

app = Flask(__name__)

def prediction(img):
    i = np.asarray(img) / 255.0
    i = i.reshape(1, 224, 224, 3)
    predicting = model.predict(i)
    result = label[np.argmax(predicting)]
    return result

@app.route("/")
def home():
    return "Hello, World!"

@app.route("/batik-prediction", methods=["GET", "POST"])
def index():
    file = request.files.get('file')
    if file is None or file.filename == "":
        return jsonify("No File Selected")
    
    image_bytes = file.read()
    img = Image.open(io.BytesIO(image_bytes))
    img = img.resize((224, 224), Image.NEAREST)
    pred_img = prediction(img)
    return pred_img

if __name__ == "__main__":
    app.run(debug=True)