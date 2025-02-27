from comps import MicroService, ServiceOrchestrator
from comps.cores.mega.constants import ServiceType, ServiceRoleType
from comps.cores.proto.api_protocol import (
    ChatCompletionRequest, 
    ChatCompletionResponse,
    create_error_response,
    ApiErrorCode,
    ChatMessage,
    ChatCompletionResponseChoice,
    UsageInfo
)
import os
import time
import traceback
from fastapi import Request, Response
from fastapi.responses import StreamingResponse, JSONResponse
import logging
import json

# Configure logging with more detail
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Ollama configuration
LLM_SERVICE_HOST_IP = os.getenv("LLM_SERVICE_HOST_IP", "localhost")
LLM_SERVICE_PORT = int(os.getenv("LLM_SERVICE_PORT", 8008))
LLM_MODEL = os.getenv("LLM_MODEL", "llama3.2:1b")


def align_inputs(self, inputs, cur_node, runtime_graph, **kwargs):
    """Transform inputs for the Ollama LLM service."""
    logger.debug(f"Aligning inputs for {cur_node}: {inputs}")
    if self.services[cur_node].service_type == ServiceType.LLM:
        # Ollama expects 'model' parameter
        if "model" not in inputs:
            inputs["model"] = LLM_MODEL
    return inputs


def align_outputs(self, data, cur_node, inputs, runtime_graph, **kwargs):
    """Handle outputs from the Ollama LLM service."""
    logger.debug(f"Aligning outputs for {cur_node}: {data}")
    return data


class ExampleService:
    def __init__(self, host="0.0.0.0", port=8000):
        self.host = host
        self.port = port
        self.endpoint = "/v1/example-service"
        
        # Register alignment functions
        ServiceOrchestrator.align_inputs = align_inputs
        ServiceOrchestrator.align_outputs = align_outputs
        
        self.megaservice = ServiceOrchestrator()
        self.llm_service = None

    def add_remote_service(self):
        logger.info(f"Connecting to Ollama LLM service at {LLM_SERVICE_HOST_IP}:{LLM_SERVICE_PORT}")
        
        # Check if Ollama is directly available
        try:
            import requests
            health_url = f"http://{LLM_SERVICE_HOST_IP}:{LLM_SERVICE_PORT}/api/version"
            response = requests.get(health_url)
            logger.info(f"Ollama version check: {response.status_code} - {response.text}")
        except Exception as e:
            logger.warning(f"Could not check Ollama version: {str(e)}")
        
        llm = MicroService(
            name="llm",
            host=LLM_SERVICE_HOST_IP,
            port=LLM_SERVICE_PORT,
            endpoint="/api/chat",  # Ollama endpoint
            use_remote_service=True,
            service_type=ServiceType.LLM,
        )
        self.megaservice.add(llm)
        
        # Save reference for direct access in handle_request
        self.llm_service = llm
    
    async def handle_request(self, request: Request):
        try:
            # Parse the incoming request
            data = await request.json()
            logger.info(f"Received request: {data}")
            
            # Validate the request
            if "messages" not in data:
                error_msg = "Missing 'messages' field in request"
                logger.error(error_msg)
                return JSONResponse(
                    status_code=400,
                    content={"error": error_msg}
                )
            
            # Direct call to Ollama API for simplicity in debugging
            import httpx
            
            ollama_url = f"http://{LLM_SERVICE_HOST_IP}:{LLM_SERVICE_PORT}/api/chat"
            
            # Prepare Ollama-specific payload
            ollama_payload = {
                "model": data.get("model", LLM_MODEL),
                "messages": data.get("messages", []),
                "stream": data.get("stream", False),
                "options": {
                    "temperature": data.get("temperature", 0.7),
                    "top_p": data.get("top_p", 1.0),
                }
            }
            
            if "max_tokens" in data:
                ollama_payload["options"]["num_predict"] = data["max_tokens"]
                
            logger.info(f"Sending to Ollama: {ollama_payload}")
            
            # Make direct HTTP request to Ollama
            async with httpx.AsyncClient(timeout=60.0) as client:
                ollama_response = await client.post(ollama_url, json=ollama_payload)
                
                if ollama_response.status_code != 200:
                    logger.error(f"Ollama error: {ollama_response.status_code} - {ollama_response.text}")
                    return JSONResponse(
                        status_code=ollama_response.status_code,
                        content={"error": f"Ollama API error: {ollama_response.text}"}
                    )
                
                # Process Ollama response
                try:
                    response_data = ollama_response.json()
                    logger.info(f"Ollama response: {response_data}")
                    
                    # Format as OpenAI-compatible response
                    formatted_response = {
                        "id": f"chatcmpl-{os.urandom(4).hex()}",
                        "object": "chat.completion",
                        "created": int(time.time()),
                        "model": ollama_payload["model"],
                        "choices": [
                            {
                                "index": 0,
                                "message": {
                                    "role": "assistant",
                                    "content": response_data["message"]["content"]
                                },
                                "finish_reason": "stop"
                            }
                        ],
                        "usage": {
                            "prompt_tokens": -1,
                            "completion_tokens": -1,
                            "total_tokens": -1
                        }
                    }
                    
                    return JSONResponse(content=formatted_response)
                    
                except Exception as parse_error:
                    logger.error(f"Error parsing Ollama response: {str(parse_error)}")
                    logger.error(f"Response content: {ollama_response.text}")
                    return JSONResponse(
                        status_code=500,
                        content={"error": f"Failed to parse Ollama response: {str(parse_error)}"}
                    )
            
        except Exception as e:
            logger.error(f"Error handling request: {str(e)}")
            logger.error(traceback.format_exc())
            return JSONResponse(
                status_code=500,
                content={"error": f"Internal server error: {str(e)}"}
            )
            
    def start(self):
        self.service = MicroService(
            self.__class__.__name__,
            service_role=ServiceRoleType.MEGASERVICE,
            host=self.host,
            port=self.port,
            endpoint=self.endpoint,
            input_datatype=ChatCompletionRequest,
            output_datatype=ChatCompletionResponse,
        )
        self.service.add_route(self.endpoint, self.handle_request, methods=["POST"])
        logger.info(f"Starting ExampleService on {self.host}:{self.port}{self.endpoint}")
        self.service.start()


if __name__ == "__main__":
    example = ExampleService()
    example.add_remote_service()
    example.start()