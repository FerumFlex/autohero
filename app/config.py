from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    debug: bool = Field(env="debug", default=True)
    database_url: str = Field(env="database_url")

    sentry_dsn: str = Field(env="sentry_dsn", default="")
    sentry_sample_rate: float = Field(env="sentry_sample_rate", default=0.05)
    environment: str = Field(env="environment", default="local")
    version: str = Field(env="version", default="local")
    microservice: str = Field(env="microservice", default="web")

    anchor_provider_url: str = Field(env="anchor_provider_url", default="https://api.devnet.solana.com")
    storage_address: str = Field(env="storage_address")

    openai_api_key: str = Field(env="openai_api_key")
    langsmith_api_key: str = Field(env="langsmith_api_key")


settings = Settings()