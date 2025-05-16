import os

from config import settings
from langchain.output_parsers import PydanticOutputParser
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from models import Choice, Event
from pydantic import BaseModel, Field

if settings.langsmith_api_key:
    os.environ["LANGCHAIN_TRACING_V2"] = "true"
    os.environ["LANGCHAIN_ENDPOINT"] = "https://api.smith.langchain.com"
    os.environ["LANGCHAIN_API_KEY"] = settings.langsmith_api_key
    os.environ["LANGCHAIN_PROJECT"] = "autohero"


class HeroNameGenerator(BaseModel):
    name: str = Field(description="name of the hero")


model = ChatOpenAI(
    openai_api_key=settings.openai_api_key,
    model="gpt-4o-mini",
)


class EventLLM(BaseModel):
    title: str = Field(description="title of the event")
    description: str = Field(description="description of the event")
    choices: list[Choice] = Field(description="choices of the event, what hero can do")


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
- Use markdown format.
- Use bold for stats changes.
- Use italic for event title and description.
- Use new line for new paragraph.

Generate message to explain how this happened.
Include changes in stats. Make it maximum 4 sentences long.

You have this event:
------
{title}
{description}
------
You have this change in hero stats:
{stats}

Example of changes in stats:
Money: +10
Level: +1
Attack: +1
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
    return result.content.strip()


def generate_hero_name(race: str) -> str:
    query = """
You are RPG content generator.
You generate name of the hero.

You have this race:
{race}

"""
    prompt = PromptTemplate(
        template=query,
        input_variables=["race"],
    )
    chain = prompt | model.with_structured_output(HeroNameGenerator)
    result = chain.invoke({"race": race})
    return result.name
