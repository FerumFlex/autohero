import sentry  # noqa
from config import settings
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import event_router, hero_router

app = FastAPI(
    openapi_url="/openapi.json" if settings.debug else None,
    debug=True,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "OK"}


app.include_router(hero_router)
app.include_router(event_router)
