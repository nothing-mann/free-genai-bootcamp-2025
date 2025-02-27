import requests
import json

def check_ollama_connection():
    print("Testing Ollama connection...")
    
    # Check if Ollama is running and accessible
    try:
        response = requests.get("http://localhost:8008/api/version")
        print(f"Ollama version response: {response.status_code}")
        print(f"Ollama version: {response.text}")
    except Exception as e:
        print(f"Failed to connect to Ollama: {str(e)}")
        return
    
    # Try a simple chat completion
    try:
        url = "http://localhost:8008/api/chat"
        
        payload = {
            "model": "llama3.2:1b",
            "messages": [
                {"role": "user", "content": "Hello! Can you hear me?"}
            ],
            "stream": False
        }
        
        print(f"Sending request to Ollama: {json.dumps(payload)}")
        response = requests.post(url, json=payload)
        
        print(f"Status code: {response.status_code}")
        print(f"Response content: {response.text}")
        
        if response.status_code == 200:
            try:
                json_response = response.json()
                print(f"Response JSON: {json.dumps(json_response, indent=2)}")
            except:
                print("Response is not valid JSON")
        
    except Exception as e:
        print(f"Error testing Ollama API: {str(e)}")

if __name__ == "__main__":
    check_ollama_connection()