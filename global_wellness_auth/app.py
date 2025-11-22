"""Flask application factory."""
from flask import Flask
from config import DevelopmentConfig
from extensions import db, jwt
from models import User


def create_app(config_class=DevelopmentConfig):
    """Create and configure the Flask application."""
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    
    # Register blueprints
    from auth.routes import auth_bp
    from profile.routes import profile_bp
    from conversation.routes import conversation_bp
    from admin import admin_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(conversation_bp)
    app.register_blueprint(admin_bp)
    
    # CLI command to create database tables
    @app.cli.command('create-db')
    def create_db():
        """Create database tables."""
        db.create_all()
        print("Database tables created successfully!")
    
    # Root route
    @app.route('/')
    def index():
        """Home page."""
        from flask import render_template
        return render_template('index.html')
    
    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)

