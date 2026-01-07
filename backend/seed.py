from sqlmodel import Session, select
from sqlmodel import Session, select
from .database import engine, create_db_and_tables
from .models import User, UserRole
from .auth import get_password_hash

def seed():
    create_db_and_tables()
    with Session(engine) as session:
        # Check if users exist
        if session.exec(select(User)).first():
            print("Users already seeded.")
            return

        users = [
            User(email="ad@g.com", hashed_password=get_password_hash("12345678"), role=UserRole.ADMIN),
            User(email="a@g.com", hashed_password=get_password_hash("12345678"), role=UserRole.ANALYST),
            User(email="p@g.com", hashed_password=get_password_hash("12345678"), role=UserRole.PARTNER),
        ]

        for user in users:
            session.add(user)
        
        session.commit()
        print("Seeded users: ad@g.com (Admin), a@g.com (Analyst), p@g.com (Partner). Password: 12345678")

if __name__ == "__main__":
    seed()
