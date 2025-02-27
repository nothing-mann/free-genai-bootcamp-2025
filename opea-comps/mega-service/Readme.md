# Mega-Service Setup and Testing Guide

## Prerequisites
- Docker and Docker Compose installed
- Python 3.8+ installed
- Git installed
- Internet connection
- (Optional) Corporate proxy settings if required

## Step-by-Step Setup

### 1. Navigate to Project Directory
```bash
cd /home/sudeep/dev/gitprojects/free-genai-bootcamp-2025/opea-comps/mega-service
```

### 2. Create Python Virtual Environment
```bash
# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
# Get your host IP
ip addr show  # or
hostname -I

# Create .env file in the root directory
cat > ../.env << EOL
LLM_ENDPOINT_PORT=8008
LLM_MODEL_ID=llama3.2:1b
host_ip=<your_ip_from_above>
no_proxy=localhost,127.0.0.1
EOL

# If behind corporate proxy, add these to .env:
# http_proxy=http://proxy.example.com:8080
# https_proxy=http://proxy.example.com:8080
```

### 4. Start Services
```bash
# From opea-comps directory
cd ..
docker compose up -d

# Verify container is running
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep ollama

# Return to mega-service directory
cd mega-service

# Run the app.py file
python app.py
```

### 5. Download and Verify Model
```bash
# Pull the model
curl http://localhost:8008/api/pull -d '{
  "model": "llama3.2:1b"
}'
```

### 6. Run Tests
```bash
# Run ollama
python check_ollama_connection.py

# Run example service test
python pytest test_example_service.py


```

### 7. Try Example Queries
```bash
# Test basic generation
curl --noproxy "*" http://localhost:8008/api/generate -d '{
  "model": "llama3.2:1b",
  "prompt": "Explain quantum computing in one sentence"
}'

# Test via Python client (if available)
python examples/basic_query.py
```

## Troubleshooting Guide

### Common Issues and Solutions:

1. Container Won't Start
```bash
# Check container logs
docker logs ollama-server

# Verify port availability
sudo lsof -i :8008
```

2. Model Download Issues
```bash
# Check network connectivity
curl -v http://localhost:8008/api/health

# Check proxy settings
env | grep -i proxy
```

3. Test Failures
```bash
# Check service health
curl http://localhost:8008/api/list

# Verify Python environment
pip list | grep -E "requests|pytest"
```

4. Permission Issues
```bash
# Check directory permissions
ls -la
sudo chown -R $(whoami):$(whoami) .

# Check Docker permissions
docker ps || sudo usermod -aG docker $USER
```

## Cleanup

```bash
# Stop services
cd ..
docker compose down

# Remove downloaded models (optional)
docker volume rm opea-comps_ollama_models

# Deactivate virtual environment
deactivate
```