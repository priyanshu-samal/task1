from typing import Optional
from sqlmodel import Field, SQLModel
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    ANALYST = "analyst"
    PARTNER = "partner"

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    hashed_password: str
    role: UserRole = Field(default=UserRole.ANALYST)
    is_active: bool = Field(default=True)

class DealStage(str, Enum):
    SOURCED = "Sourced"
    SCREEN = "Screen"
    DILIGENCE = "Diligence"
    IC = "IC"
    INVESTED = "Invested"
    PASSED = "Passed"

class Deal(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    company_url: Optional[str] = None
    owner_id: int = Field(foreign_key="user.id")
    stage: DealStage = Field(default=DealStage.SOURCED)
    round: Optional[str] = None
    check_size: Optional[float] = None
    status: str = Field(default="active")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Activity(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    deal_id: int = Field(foreign_key="deal.id")
    user_id: int = Field(foreign_key="user.id")
    type: str # e.g. "stage_change", "comment"
    description: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class Memo(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    deal_id: int = Field(foreign_key="deal.id")
    current_version_id: Optional[int] = Field(default=None)

class MemoVersion(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    memo_id: int = Field(foreign_key="memo.id")
    content: str # JSON string storing sections
    created_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: int = Field(foreign_key="user.id")
