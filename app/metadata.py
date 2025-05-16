from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Hello, World!"}


@app.get("/{mint}")
def read_mint(mint: str) -> dict:
    return {
        "name": "AutoHeroRPG Token",
        "symbol": "RPG",
        "description": "AutoHeroRPG – AI-Powered NFT Adventure Game on Solana",
        "website": "https://autoherorpg.com",
        "image": f"https://images.autoherorpg.com/{mint}.png",
    }
