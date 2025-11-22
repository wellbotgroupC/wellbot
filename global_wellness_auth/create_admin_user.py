"""Script to create or promote a user to admin."""
from app import create_app
from models import User
from extensions import db

# Test credentials
TEST_EMAIL = 'admin@test.com'
TEST_PASSWORD = 'admin123'

app = create_app()

with app.app_context():
    # Check if user already exists
    user = User.query.filter_by(email=TEST_EMAIL).first()
    
    if user:
        # User exists, promote to admin
        user.is_admin = True
        db.session.commit()
        print(f"✓ User {TEST_EMAIL} has been promoted to admin")
    else:
        # Create new admin user
        user = User(
            email=TEST_EMAIL,
            name='Admin User',
            is_admin=True,
            preferred_language='en'
        )
        user.set_password(TEST_PASSWORD)
        db.session.add(user)
        db.session.commit()
        print(f"✓ Admin user created successfully!")
        print(f"  Email: {TEST_EMAIL}")
        print(f"  Password: {TEST_PASSWORD}")
        print(f"  Admin: True")
    
    # Verify
    user = User.query.filter_by(email=TEST_EMAIL).first()
    if user and user.is_admin:
        print(f"\n✓ Verification: {TEST_EMAIL} is now an admin user")
    else:
        print(f"\n✗ Error: Failed to create/promote admin user")

