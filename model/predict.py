import sys
import json
import numpy as np
from tensorflow.keras.models import load_model

model = load_model("model/mlp_model.h5")

# Đọc input từ stdin (NestJS truyền vào)
input_data = json.loads(sys.stdin.read())
input_array = np.array(input_data).reshape(1, -1)

# Dự đoán
pred = model.predict(input_array)[0]  # vector 27 số

# Lấy top 3 index lớn nhất
top3_indices = np.argsort(pred)[-3:][::-1]
top3_probs = [float(pred[i]) for i in top3_indices]

# Trả kết quả
print(json.dumps({
    "indices": top3_indices.tolist(),
    "probabilities": top3_probs
}))
