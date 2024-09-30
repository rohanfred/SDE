import schemas
from models import User,Docs,TimeProf
from database import Base, engine, SessionLocal
from fastapi import FastAPI, Depends, HTTPException,status, UploadFile, Form, File,BackgroundTasks
from sqlalchemy.orm import Session
from utils import get_hashed_password,verify_password,s3wt,s3rdsave,utcnow
from pathlib import Path
from typing import Annotated
import datetime
import traceback
from config import settings
from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import StreamingResponse
from fastapi.responses import FileResponse
import os

# Base.metadata.drop_all(engine)
Base.metadata.create_all(engine)

def get_session():
    session=SessionLocal()
    try:
        yield session
    finally:
        session.close()

def addtime(apinm: str,ssnid: str,usrid: int,st: datetime.datetime,db: Session):
    tprof=TimeProf(api=apinm,session_id=ssnid,user_id=usrid,start=st,end=utcnow())
    try:
        db.add(tprof)
        db.commit()
        db.refresh(tprof)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.args)

def cleanup(filepath):
    os.unlink(filepath)

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register",response_model=schemas.Msg)
async def register_user(user: schemas.UserCreate, db: Session= Depends(get_session)):
    existing_user=db.query(User).filter((User.email==user.email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    encrypted_password=get_hashed_password(user.password)

    new_user=User(username=user.username, email=user.email, password=encrypted_password)
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.args)

    return {"user_id":new_user.id,"message": "User created successfully"}

@app.post('/login/{session_id}',response_model=schemas.GetDocs)
async def login(session_id: str, request: schemas.UserBase, db: Session = Depends(get_session)):
    api="login"
    st=utcnow()
    user= db.query(User).filter_by(email=request.email).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User does not exist")
    user_id=user.id
    hashed_pass=user.password
    if not verify_password(request.password,hashed_pass):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect password"
        )
    docs=db.query(Docs).filter_by(owner_id=user_id).order_by(Docs.created_at.desc()).offset(0).limit(100).all()
    addtime(api,session_id,user_id,st,db)
    return {"message":"User logged in successfully", "user_id":user_id, "docs":docs}

@app.post('/upload/{session_id}/{user_id}',response_model=schemas.GetDocs)
async def upload(session_id: str,user_id: int, file: Annotated[UploadFile,File()], doc_title: Annotated[str,Form()],doc_author: Annotated[str,Form()],doc_category: Annotated[str,Form()],db: Session = Depends(get_session)):
    doc= db.query(Docs).filter_by(owner_id=user_id,title=doc_title,author=doc_author,category=doc_category).first()
    if doc:
        raise HTTPException(status_code=400, detail="User has already uploaded this document")
    usr= db.query(User).filter_by(id=user_id).first()
    if usr is None:
        raise HTTPException(status_code=400, detail="User is not registered")
    api="upload"
    st=utcnow()
    infnm=file.filename
    sfx=Path(infnm).suffix
    utcts=datetime.datetime.now(datetime.timezone.utc).timestamp()
    outfnm=f'{user_id}_{utcts}{sfx}'
    # outpath=Path('output')/outfnm
    # outpath.parent.mkdir(parents=True,exist_ok=True)
    # try:
    #     with open(outpath, 'wb') as fp:
    #         fp.write(file.file.read())
    # except Exception as e:
    #     traceback.print_exc()
    #     raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.args)
    # new_doc=Docs(filename=infnm,title=doc_title, author=doc_author, category=doc_category, owner=user_id, filepath=outpath.as_posix())
    try:
        s3wt(file.file,settings.S3_BUCKET,outfnm)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="S3 upload failed")
    new_doc=Docs(filename=infnm,title=doc_title, author=doc_author, category=doc_category, owner_id=user_id, filepath=f's3://{settings.S3_BUCKET}/{outfnm}')
    
    try:
        db.add(new_doc)
        db.commit()
        db.refresh(new_doc)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.args)
    
    docs=db.query(Docs).filter_by(owner_id=user_id).order_by(Docs.created_at.desc()).offset(0).limit(100).all()
    addtime(api,session_id,user_id,st,db)
    return {"message":"Document uploaded successfully", "user_id":user_id, "docs":docs}

@app.post('/search/{session_id}/{user_id}',response_model=schemas.GetDocs)
async def search(session_id: str,user_id: int, request: schemas.DocSearch, db: Session= Depends(get_session)):
    api="search"
    st=utcnow()
    filtr={k:v for k,v in request.model_dump().items() if v}
    docs=db.query(Docs).filter_by(**filtr).order_by(Docs.created_at.desc()).offset(0).limit(100).all()
    addtime(api,session_id,user_id,st,db)
    return {"message":"success","user_id":user_id,"docs":docs}


@app.post('/download/{session_id}/{user_id}',response_class=FileResponse)
async def download(session_id: str,user_id: int,s3file: schemas.S3File,bg_tasks: BackgroundTasks, db: Session= Depends(get_session)):
    api="download"
    st=utcnow()
    try:
        localpath = s3rdsave(s3file.filepath)
        bg_tasks.add_task(cleanup,localpath)
        bg_tasks.add_task(addtime,api,session_id,user_id,st,db)
        return FileResponse(localpath)
        # result = s3rd(s3file.filepath)
        # return StreamingResponse(content=result["Body"].iter_chunks())
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.args)
