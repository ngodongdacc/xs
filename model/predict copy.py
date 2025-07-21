# model/predict.py
import sys, json
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# Đọc file dữ liệu mẫu
with open('model/samples.json', 'r') as f:
    dataset = json.load(f)

X = np.array([sample['input'] for sample in dataset])
Y = np.array([sample['output'] for sample in dataset])  # 27 xác suất / nhị phân

# Nhận input từ stdin
input_data = json.loads(sys.stdin.read())
input_vec = np.array(input_data).reshape(1, -1)

# Tính độ tương đồng cosine với toàn bộ mẫu
similarities = cosine_similarity(input_vec, X)[0]

# Lấy top N mẫu tương đồng nhất
top_n = 5
top_indices = similarities.argsort()[-top_n:][::-1]

# Tổng hợp xác suất đầu ra từ các mẫu tương đồng
output_prob = np.zeros(27)
for idx in top_indices:
    output_prob += Y[idx]

output_prob /= top_n

# Trả về top 3 số có xác suất cao nhất
top3 = sorted(
    [(i + 1, p) for i, p in enumerate(output_prob)],
    key=lambda x: x[1], reverse=True
)[:3]

print(json.dumps({
    "top3": [{"number": n, "prob": round(p, 4)} for n, p in top3]
}))
