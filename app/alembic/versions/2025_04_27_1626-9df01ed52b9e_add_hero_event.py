"""add_hero_event

Revision ID: 9df01ed52b9e
Revises: 4d6024afc62f
Create Date: 2025-04-27 16:26:06.753533

"""

from typing import Sequence, Union

import sqlalchemy as sa
import sqlmodel
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "9df01ed52b9e"
down_revision: Union[str, None] = "4d6024afc62f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "heroevent",
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("tx", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column("hero_address", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column("change", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("message", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.PrimaryKeyConstraint("tx"),
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("heroevent")
    # ### end Alembic commands ###
