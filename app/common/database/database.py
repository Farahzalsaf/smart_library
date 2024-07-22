from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker , declarative_base
from config import DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE

# Fetch database URL from environment variables
DATABASE_URL = f"postgresql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_DATABASE}"


engine = create_engine(DATABASE_URL)
session_local = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = session_local()
    try:
        yield db
    finally:
        db.close()



