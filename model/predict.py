import sys, json
import numpy as np
import tensorflow as tf

# Load mô hình
model = tf.keras.models.load_model('model/deep_model.h5')

# Đọc input từ stdin
input_data = json.loads(sys.stdin.read())
input_vec = np.array(input_data).reshape(1, -1)

# Dự đoán
output_prob = model.predict(input_vec)[0]

# Lấy top 3 xác suất cao nhất
top3 = sorted(
    [(i + 1, p) for i, p in enumerate(output_prob)],
    key=lambda x: x[1], reverse=True
)[:3]

print(json.dumps({
    "top3": [{"number": n, "prob": round(float(p), 4)} for n, p in top3]
}))
