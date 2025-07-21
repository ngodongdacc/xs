import json
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models

# Load dữ liệu huấn luyện
with open('model/samples.json', 'r') as f:
    dataset = json.load(f)

X = np.array([sample['input'] for sample in dataset])
Y = np.array([sample['output'] for sample in dataset])

# Xây dựng mô hình
model = models.Sequential([
    layers.Input(shape=(27,)),
    layers.Dense(64, activation='relu'),
    layers.Dense(64, activation='relu'),
    layers.Dense(27, activation='sigmoid')  # Multi-label output
])

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Huấn luyện mô hình
model.fit(X, Y, epochs=50, batch_size=16)

# Lưu mô hình
model.save('model/deep_model.h5')
