# Running Ollama Third-Party Services

## Choosing a Model
You can get the model_id that ollama will launch from Ollama Library

https://ollama.com/library 

eg. https://ollama.com/library/llama3.2:1b

## Getting the host IP
```sh
sudo apt install net-tools
ifconfig
```
eg. 172.25.169.177

## Environment Variables

Before running the Docker Compose file, set the following environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| LLM_ENDPOINT_PORT | Port on which Ollama server will be accessible | 8008 |
| LLM_MODEL_ID | The ID of the LLM model to use | llama3.2:1b |
| host_ip | Host machine IP address | - |
| http_proxy | HTTP proxy if required | - |
| https_proxy | HTTPS proxy if required | - |
| no_proxy | Addresses to exclude from proxy | - |

### Example .env file:
```env
LLM_ENDPOINT_PORT=8008
LLM_MODEL_ID=llama3.2:1b
host_ip={your_ip_address}
http_proxy=http://proxy.example.com:{your_proxy} # if you don't need proxy, comment it out  
https_proxy=http://proxy.example.com:{your_proxy} # if you don't need proxy, comment it out
no_proxy=localhost,127.0.0.1
```

## Running the Server

Make sure you're in the root directory of the project and run:
```bash
cd <directory>
docker compose up -d
```

## Connect to an API
https://github.com/ollama/ollama/blob/main/docs/api.md 

## Download (Pull) a model
curl http://localhost:8008/api/pull -d '{
  "model": "llama3.2:1b"
}'

## Generate a response from the API
curl --noproxy "*" http://localhost:8008/api/generate -d '{
  "model": "llama3.2:1b",
  "prompt":"Why is the sky blue?"
}'

## Technical Uncertainty

### Q. Using OPEA does it serve the model via a LLM server?
Yes, OPEA (Open Processing Engine Architecture) uses Ollama as an LLM server. Ollama handles model serving, inference, and API endpoints. The model runs as a containerized service that can be accessed via REST API calls on port 11434 (mapped to your specified port).

### Q. How do we orchestrate two services together?
Services in OPEA can be orchestrated using Docker Compose, which manages the multi-container setup. Each service is defined in the docker-compose.yml file and can communicate with other services through:
- Network bridges (default Docker network)
- Environment variables for configuration
- Exposed ports for API communication
- Shared volumes if needed for data persistence

### Q. What is the quality of build across the various OPEA Comps?
The OPEA components are built with the following quality considerations:
- Containerization ensures consistent environments
- Health checks and container lifecycle management
- Standard Docker practices for reproducibility
- Version-controlled dependencies
- API versioning for compatibility
- Error handling and logging capabilities

### Q. Does bridge mode mean we can only access model in the docker compose?
No, bridge mode is Docker's default network driver that allows containers to communicate with each other and with the host machine. When we expose ports (like 8008:11434), the service becomes accessible:
- From the host machine via localhost:8008
- From other containers in the same network via container name
- From external networks via host_ip:8008
The bridge network provides isolation while still allowing controlled external access.

### Q. Which port is being mapped 8008 -> 11434?
The port mapping in the docker-compose.yml uses format `${LLM_ENDPOINT_PORT:-8008}:11434` where:
- 11434 is Ollama's internal container port (right side)
- 8008 is the external port on your host machine (left side)
- Requests to host_ip:8008 are forwarded to the container's port 11434
- 8008 is the default if LLM_ENDPOINT_PORT isn't specified

### Q. If we pass the LLM_MODEL_ID to the ollama server will it download the model when on start?
No, passing LLM_MODEL_ID as an environment variable alone doesn't trigger the model download. You need to:
1. First start the Ollama server with `docker compose up -d`
2. Then explicitly pull the model using the API endpoint:
```bash
curl http://localhost:8008/api/pull -d '{
  "model": "llama3.2:1b"
}'
```
This two-step process ensures:
- Controlled model downloads
- Better error handling
- Progress tracking during download
- Verification of model availability

### Q. Will the model be downloaded in the container? Does that mean the ML model will be deleted when the container stops?
By default, Ollama stores downloaded models in its container at `/root/.ollama/models`. However, these models will persist even when the container stops because:

1. Docker containers have a writable layer that persists between container restarts
2. Only removing the container with `docker rm` would delete the models
3. To ensure permanent persistence across container removals, you should add a volume mount:

```yaml
services:
  ollama-server:
    volumes:
      - ollama_models:/root/.ollama/models

volumes:
  ollama_models:
```

This creates a named volume that:
- Persists model data independently of the container lifecycle
- Saves download time when restarting containers
- Preserves models even if the container is removed
- Can be backed up and restored