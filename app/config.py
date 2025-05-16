from dotenv import load_dotenv
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from solders.pubkey import Pubkey

load_dotenv()


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    debug: bool = Field(env="debug", default=True)
    database_url: str = Field(env="database_url")

    sentry_dsn: str = Field(env="sentry_dsn", default="")
    sentry_sample_rate: float = Field(env="sentry_sample_rate", default=0.05)
    environment: str = Field(env="environment", default="local")
    version: str = Field(env="version", default="local")
    microservice: str = Field(env="microservice", default="web")

    anchor_provider_url: str = Field(
        env="anchor_provider_url", default="https://api.devnet.solana.com"
    )

    openai_api_key: str = Field(env="openai_api_key")
    langsmith_api_key: str | None = Field(env="langsmith_api_key", default=None)
    program_id: str = Field(env="program_id", default="")

    def program_id_key(self) -> Pubkey:
        return Pubkey.from_string(self.program_id)

    def storage_address(self) -> Pubkey:
        storage_address, _ = Pubkey.find_program_address(
            seeds=[b"events_storage"],
            program_id=self.program_id_key(),
        )
        return str(storage_address)


settings = Settings()
