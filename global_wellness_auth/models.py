"""Database models."""
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from extensions import db


class User(db.Model):
    """User model for authentication and profile management."""
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(100), nullable=True)
    age_group = db.Column(db.String(10), nullable=True)
    preferred_language = db.Column(db.String(2), default='en', nullable=False)
    is_admin = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Allowed values
    ALLOWED_AGE_GROUPS = ['18-25', '26-35', '36-50', '50+']
    ALLOWED_LANGUAGES = ['en', 'hi']

    def set_password(self, plain_password: str) -> None:
        """Hash and set the user's password."""
        self.password_hash = generate_password_hash(plain_password)

    def check_password(self, plain_password: str) -> bool:
        """Check if the provided password matches the stored hash."""
        return check_password_hash(self.password_hash, plain_password)

    def to_dict(self) -> dict:
        """Return a safe JSON representation of the user (no password hash)."""
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'age_group': self.age_group,
            'preferred_language': self.preferred_language,
            'is_admin': self.is_admin,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self) -> str:
        return f'<User {self.email}>'


class ConversationLog(db.Model):
    """Model for logging conversation interactions."""
    __tablename__ = 'conversation_logs'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True, index=True)
    session_id = db.Column(db.String(255), nullable=False, index=True)
    user_message = db.Column(db.Text, nullable=False)
    bot_response = db.Column(db.Text, nullable=False)
    intent = db.Column(db.String(100), nullable=True)
    symptom = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, index=True)

    # Relationship
    user = db.relationship('User', backref='conversation_logs', lazy=True)

    def to_dict(self) -> dict:
        """Return a JSON representation of the conversation log."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'session_id': self.session_id,
            'user_message': self.user_message,
            'bot_response': self.bot_response,
            'intent': self.intent,
            'symptom': self.symptom,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self) -> str:
        return f'<ConversationLog {self.id} session={self.session_id[:8]}...>'


class Feedback(db.Model):
    """Model for storing user feedback on bot responses."""
    __tablename__ = 'feedback'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True, index=True)
    session_id = db.Column(db.String(255), nullable=False, index=True)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, index=True)

    # Relationship
    user = db.relationship('User', backref='feedback_entries', lazy=True)

    def to_dict(self) -> dict:
        """Return a JSON representation of the feedback."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'session_id': self.session_id,
            'rating': self.rating,
            'comment': self.comment,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self) -> str:
        return f'<Feedback {self.id} rating={self.rating}>'

