"""add_storage_id

Revision ID: d3dd5092db04
Revises: 81332c851faa
Create Date: 2024-04-04 00:43:51.176177

"""

from typing import Sequence, Union

import sqlalchemy as sa
import sqlmodel
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "d3dd5092db04"
down_revision: Union[str, None] = "81332c851faa"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "event",
        sa.Column("storage_id", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("event", "storage_id")
    # ### end Alembic commands ###
