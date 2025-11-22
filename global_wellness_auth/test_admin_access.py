"""Quick test to verify admin user and route access."""
from app import create_app
from models import User
from extensions import db

app = create_app()

with app.app_context():
    # Check admin user
    admin_user = User.query.filter_by(email='admin@test.com').first()
    if admin_user:
        print(f"✓ Admin user found: {admin_user.email}")
        print(f"  - is_admin: {admin_user.is_admin}")
        print(f"  - ID: {admin_user.id}")
    else:
        print("✗ Admin user not found!")
    
    # Check all users
    print("\nAll users in database:")
    users = User.query.all()
    for user in users:
        print(f"  - {user.email} (ID: {user.id}, Admin: {user.is_admin})")

