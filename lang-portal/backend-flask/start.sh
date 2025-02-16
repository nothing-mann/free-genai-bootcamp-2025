 #!/bin/bash
export FLASK_APP=run.py
export FLASK_ENV=development
export FLASK_DEBUG=1

# Make sure the database exists and is migrated
python -m flask db upgrade

# Start the Flask application
python run.py
