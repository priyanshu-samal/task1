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
            User(email="admin@example.com", hashed_password=get_password_hash("password"), role=UserRole.ADMIN),
            User(email="analyst@example.com", hashed_password=get_password_hash("password"), role=UserRole.ANALYST),
            User(email="partner@example.com", hashed_password=get_password_hash("password"), role=UserRole.PARTNER),
        ]

        for user in users:
            session.add(user)
        
        session.commit()
        print("Seeded users: admin@example.com, analyst@example.com, partner@example.com (password: password)")

if __name__ == "__main__":
    seed()
