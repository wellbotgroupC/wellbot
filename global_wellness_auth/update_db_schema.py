"""Script to update database schema for Module 4."""
import sqlite3
from pathlib import Path
from app import create_app
from extensions import db

app = create_app()

with app.app_context():
    # Get database path
    db_path = Path(app.instance_path) / 'wellness.db'
    
    if not db_path.exists():
        print("Database doesn't exist. Creating new database with all tables...")
        db.create_all()
        print("✓ Database created successfully!")
    else:
        print(f"Updating existing database at {db_path}")
        
        # Connect directly to SQLite to add columns
        conn = sqlite3.connect(str(db_path))
        cursor = conn.cursor()
        
        try:
            # Check if is_admin column exists
            cursor.execute("PRAGMA table_info(users)")
            columns = [row[1] for row in cursor.fetchall()]
            
            if 'is_admin' not in columns:
                print("Adding is_admin column to users table...")
                cursor.execute("ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT 0 NOT NULL")
                conn.commit()
                print("✓ Added is_admin column")
            else:
                print("✓ is_admin column already exists")
            
            # Check if conversation_logs table exists
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='conversation_logs'")
            if not cursor.fetchone():
                print("Creating conversation_logs table...")
                db.create_all()  # This will create missing tables
                print("✓ Created conversation_logs table")
            else:
                print("✓ conversation_logs table already exists")
            
            # Check if feedback table exists
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='feedback'")
            if not cursor.fetchone():
                print("Creating feedback table...")
                db.create_all()  # This will create missing tables
                print("✓ Created feedback table")
            else:
                print("✓ feedback table already exists")
                
        except Exception as e:
            print(f"Error: {e}")
            conn.rollback()
        finally:
            conn.close()
    
    print("\n✓ Database schema update complete!")

