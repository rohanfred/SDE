from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from config import settings

# engine=create_engine(settings.DATABASE_URL,connect_args={'sslmode':'require'})
engine=create_engine(settings.DATABASE_URL,pool_size=0,pool_pre_ping=True)

# for sqlite
# DATABASE_URL="sqlite:///./sql_app.db"
# engine=create_engine(DATABASE_URL,connect_args={'check_same_thread':False})
SessionLocal= sessionmaker(autocommit=False,autoflush=False,bind=engine)
Base=declarative_base()