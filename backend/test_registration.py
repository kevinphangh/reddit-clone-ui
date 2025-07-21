import requests
import json

# Test registration
url = "https://via-forum-api.fly.dev/api/auth/register"
data = {
    "username": "test_user1",
    "email": "test1@test.dk", 
    "password": "TestPassword123"
}

response = requests.post(url, json=data)
print(f"Status: {response.status_code}")
print(f"Response: {response.text}")

if response.status_code == 200:
    print("Success! User created")
else:
    print("Failed to create user")