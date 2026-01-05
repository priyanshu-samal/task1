from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from datetime import datetime

from ..database import get_session
from ..models import Deal, User, Activity, DealStage
from ..auth import get_current_user

router = APIRouter(prefix="/deals", tags=["deals"])

@router.post("/", response_model=Deal)
async def create_deal(deal: Deal, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    deal.owner_id = current_user.id
    session.add(deal)
    session.commit()
    session.refresh(deal)
    
    # Log activity
    activity = Activity(
        deal_id=deal.id,
        user_id=current_user.id,
        type="created",
        description=f"Deal '{deal.name}' created by {current_user.email}"
    )
    session.add(activity)
    session.commit()
    
    return deal

@router.get("/", response_model=List[Deal])
async def read_deals(session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    deals = session.exec(select(Deal)).all()
    return deals

@router.patch("/{deal_id}", response_model=Deal)
async def update_deal(deal_id: int, deal_update: Deal, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    deal_db = session.get(Deal, deal_id)
    if not deal_db:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    # Track stage change
    old_stage = deal_db.stage
    
    deal_data = deal_update.dict(exclude_unset=True)
    for key, value in deal_data.items():
        setattr(deal_db, key, value)
    
    deal_db.updated_at = datetime.utcnow()
    session.add(deal_db)
    session.commit()
    session.refresh(deal_db)
    
    if "stage" in deal_data and old_stage != deal_db.stage:
        activity = Activity(
             deal_id=deal_db.id,
             user_id=current_user.id,
             type="stage_change",
             description=f"Moved from {old_stage} to {deal_db.stage}"
        )
        session.add(activity)
        session.commit()
        
    return deal_db

@router.delete("/{deal_id}")
async def delete_deal(deal_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
         raise HTTPException(status_code=403, detail="Only admins can delete deals")
         
    deal = session.get(Deal, deal_id)
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
        
    session.delete(deal)
    session.commit()
    return {"ok": True}

@router.get("/{deal_id}/activities", response_model=List[Activity])
async def get_deal_activities(deal_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    activities = session.exec(select(Activity).where(Activity.deal_id == deal_id).order_by(Activity.timestamp.desc())).all()
    return activities
