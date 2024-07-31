from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker , declarative_base

# Fetch database URL from environment variables
DATABASE_URL = f"postgresql://falsafwan002:Passw0rd@localhost:5432/smart_library"


engine = create_engine(DATABASE_URL,  echo=True)

session_local = sessionmaker(autocommit=False, autoflush=False, bind=engine)


Base = declarative_base()

Base.metadata.create_all(bind=engine)
def get_db():
    db = session_local()
    try:
        yield db
    finally:
        db.close()

