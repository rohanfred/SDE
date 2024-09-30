from pydantic import BaseModel

class UserBase(BaseModel):
    email:str
    password:str

class UserCreate(UserBase):
    username:str

class DocSearch(BaseModel):
    title: str
    author: str|None = None
    category: str|None = None

class S3File(BaseModel):
    filepath: str

class Msg(BaseModel):
    message: str
    user_id: int

class Usr(BaseModel):
    id: int
    email: str

    class Config:
        from_attributes: True

class DocReturn(BaseModel):
    title: str
    author: str
    category: str
    filepath: str
    owner: Usr

    class Config:
        from_attributes=True

class GetDocs(BaseModel):
    message: str
    user_id: int
    docs: list[DocReturn]
