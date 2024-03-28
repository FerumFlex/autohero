import os
from langchain_openai import OpenAI
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from langchain.prompts import PromptTemplate
from models import Event

from config import settings


if settings.langsmith_api_key:
    os.environ["LANGCHAIN_TRACING_V2"] = "true"
    os.environ["LANGCHAIN_ENDPOINT"] = "https://api.smith.langchain.com"
    os.environ["LANGCHAIN_API_KEY"] = settings.langsmith_api_key
    os.environ["LANGCHAIN_PROJECT"] = "autohero"


model = OpenAI(openai_api_key=settings.openai_api_key)


class EventLLM(BaseModel):
    title: str = Field(description="title of the event")
    description: str = Field(description="description of the event")


def generate_description_title() -> EventLLM:
    query = """
You are RPG content generator. You generate event in zero player game.
Make description of the event and title. Description should be two sentences long. Title no longer than 8 words.

{format_instructions}
    """

    parser = PydanticOutputParser(pydantic_object=EventLLM)

    prompt = PromptTemplate(
        template=query,
        input_variables=[],
        partial_variables={"format_instructions": parser.get_format_instructions()},
    )

    chain = prompt | model | parser

    result = chain.invoke({"query": query})
    return result


def generage_apply_event(event: Event, change: dict[str, str]) -> str:
    query = """
You are RPG content generator.
You have this event:

------
{title}
{description}
------

You have this change in hero stats:
{stats}

Generate message to explain how this happened. Include changes in stats. Make it maximum 4 sentences long.
"""
    prompt = PromptTemplate(
        template=query,
        input_variables=["title", "description", "stats"],
    )

    stats = "\n".join([f"{k}: +{v}" for k, v in change.items()])
    params = {
        "title": event.title,
        "description": event.description,
        "stats": stats,
    }
    chain = prompt | model
    result = chain.invoke(params)
    return result.strip()
