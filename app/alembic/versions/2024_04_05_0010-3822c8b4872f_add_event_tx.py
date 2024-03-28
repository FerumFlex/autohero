"""add_event_tx

Revision ID: 3822c8b4872f
Revises: b93ea92001be
Create Date: 2024-04-05 00:10:19.674967

"""
from typing import Sequence, Union

from alembic import op
import sqlmodel
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '3822c8b4872f'
down_revision: Union[str, None] = 'b93ea92001be'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('event', sa.Column('tx', sqlmodel.sql.sqltypes.AutoString(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('event', 'tx')
    # ### end Alembic commands ###
