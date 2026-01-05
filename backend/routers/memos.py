from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from datetime import datetime

from ..database import get_session
from ..models import Memo, MemoVersion, Deal, User
from ..auth import get_current_user

router = APIRouter(prefix="/memos", tags=["memos"])

@router.get("/{deal_id}", response_model=Optional[dict])
async def get_memo(deal_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    memo = session.exec(select(Memo).where(Memo.deal_id == deal_id)).first()
    if not memo:
        return None
        
    current_version = None
    if memo.current_version_id:
        current_version = session.get(MemoVersion, memo.current_version_id)
        
    return {
        "id": memo.id,
        "deal_id": memo.deal_id,
        "content": current_version.content if current_version else "{}",
        "updated_at": current_version.created_at if current_version else None
    }

@router.post("/{deal_id}")
async def save_memo(deal_id: int, content: dict, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    # Check if deal exists
    deal = session.get(Deal, deal_id)
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")

    # Get or create Memo
    memo = session.exec(select(Memo).where(Memo.deal_id == deal_id)).first()
    if not memo:
        memo = Memo(deal_id=deal_id)
        session.add(memo)
        session.commit()
        session.refresh(memo)

    import json
    content_str = json.dumps(content)

    # Create new version
    version = MemoVersion(
        memo_id=memo.id,
        content=content_str,
        created_by=current_user.id
    )
    session.add(version)
    session.commit()
    session.refresh(version)

    # Update current version pointer
    memo.current_version_id = version.id
    session.add(memo)
    session.commit()
    
    return {"status": "saved", "version_id": version.id}

@router.get("/{deal_id}/history")
async def get_memo_history(deal_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    memo = session.exec(select(Memo).where(Memo.deal_id == deal_id)).first()
    if not memo:
        return []
    
    versions = session.exec(select(MemoVersion).where(MemoVersion.memo_id == memo.id).order_by(MemoVersion.created_at.desc())).all()
    return versions
