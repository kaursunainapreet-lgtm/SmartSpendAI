import requests

BASE = "http://127.0.0.1:5000"

# 1. Health check
r = requests.get(f"{BASE}/api/health")
print("HEALTH:", r.status_code, r.json())

# 2. Register a user
r = requests.post(f"{BASE}/api/auth/register", json={
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123",
    "age": 22,
    "profession": "Student",
    "monthlyIncome": 30000
})
print("REGISTER:", r.status_code, r.json())
user_id = r.json().get("user", {}).get("id")

# 3. Login
r = requests.post(f"{BASE}/api/auth/login", json={
    "email": "test@example.com",
    "password": "test123"
})
print("LOGIN:", r.status_code, r.json())

# 4. Add an expense (only if registration succeeded)
if user_id:
    r = requests.post(f"{BASE}/api/expenses/{user_id}", json={
        "amount": 500,
        "categories": ["Food"],
        "description": "Test lunch",
        "date": "2026-07-08",
        "paymentMethod": "UPI"
    })
    print("ADD EXPENSE:", r.status_code, r.json())

    # 5. Get summary
    r = requests.get(f"{BASE}/api/summary/{user_id}")
    print("SUMMARY:", r.status_code, r.json())