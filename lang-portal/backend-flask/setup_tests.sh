#!/bin/bash

# Install the package in development mode
pip install -e .

# Run the tests
pytest tests/ -v
