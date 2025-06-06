"""add_extra_fields

Revision ID: 182322088ad5
Revises: ff81a68e91a1
Create Date: 2025-05-05 18:18:16.022292

"""

from typing import Sequence, Union

import sqlalchemy as sa
import sqlmodel
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "182322088ad5"
down_revision: Union[str, None] = "ff81a68e91a1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "hero",
        sa.Column(
            "hero_props", postgresql.JSONB(astext_type=sa.Text()), nullable=False
        ),
    )
    op.add_column(
        "hero",
        sa.Column(
            "address_hero_data", sqlmodel.sql.sqltypes.AutoString(), nullable=False
        ),
    )
    op.add_column(
        "hero",
        sa.Column("chain_data_updated_at", sa.DateTime(timezone=True), nullable=True),
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("hero", "chain_data_updated_at")
    op.drop_column("hero", "address_hero_data")
    op.drop_column("hero", "hero_props")
    # ### end Alembic commands ###
