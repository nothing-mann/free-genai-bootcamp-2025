import requests
import json

def test_example_service():
    url = "http://localhost:8000/v1/example-service"
    
    payload = {
        "model": "llama3.2:1b",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Give me a brief description of Krishna Mandir in Patan, Nepal?"}
        ],
        "temperature": 0.7,
        "max_tokens": 200,
        "stream": False
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, data=json.dumps(payload))
    
    print(f"Status code: {response.status_code}")
    print(f"Response content: {response.content}")
    
    # Try to parse JSON only if possible
    try:
        json_response = response.json()
        print(f"Response JSON: {json.dumps(json_response, indent=2)}")
    except json.JSONDecodeError:
        print("Response is not valid JSON")

if __name__ == "__main__":
    test_example_service()