from app import create_app
from config import Config

app = create_app()

if __name__ == '__main__':
    print(f"Starting server on http://{Config.HOST}:{Config.PORT}")
    app.run(
        host=Config.HOST, 
        port=Config.PORT, 
        debug=True
    )
