import json
import numpy as np
from tensorflow import keras
from sklearn.model_selection import train_test_split

# Load dữ liệu
with open("data.json", "r") as f:
    raw_data = json.load(f)

X = np.array([sample["input"] for sample in raw_data])
y = np.array([sample["output"] for sample in raw_data])

# Chia train/test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Tạo mô hình MLP
model = keras.Sequential([
    keras.layers.Input(shape=(100,)),
    keras.layers.Dense(128, activation='relu'),
    keras.layers.Dense(64, activation='relu'),
    keras.layers.Dense(100, activation='sigmoid')  # sigmoid vì mỗi phần tử có thể độc lập
])

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Train
model.fit(X_train, y_train, epochs=50, batch_size=32, validation_split=0.1)

# Lưu model
model.save("mlp_model.h5")
