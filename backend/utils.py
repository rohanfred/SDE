from passlib.context import CryptContext
import boto3
import datetime
from pathlib import Path
import os
s3=boto3.client('s3')



password_context=CryptContext(schemes=["bcrypt"],deprecated="auto")

def get_hashed_password(password: str) -> str:
    return password_context.hash(password)

def verify_password(password: str, hashed_pass: str) -> bool:
    return password_context.verify(password,hashed_pass)

def s3wt(fobj,bkt,key):
    s3.upload_fileobj(fobj,bkt,key)

def utcnow():
    return datetime.datetime.now(datetime.timezone.utc)

def s3rd(s3path):
    parts=Path(s3path).parts[1:]
    bkt,key=parts[0],'/'.join(parts[1:])
    return s3.get_object(Bucket=bkt, Key=key)

def s3rdsave(s3path):
    parts=Path(s3path).parts[1:]
    bkt,key=parts[0],'/'.join(parts[1:])
    s3.download_file(bkt,key,key)
    return key

