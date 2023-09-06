"""create validations table

Revision ID: 0f92a7eb3ba1
Revises:
Create Date: 2023-09-06 18:08:37.498297

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0f92a7eb3ba1'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('validations',
                    sa.Column('id', sa.String, primary_key=True, index=True),
                    sa.Column('status', sa.Enum("VALID", "INVALID", name="validation_status")),
                    sa.Column('session_id', sa.String, nullable=False),
                    sa.Column('iban', sa.String, nullable=False),
                    sa.Column('timestamp', sa.DateTime, default=sa.func.now())
                    )


def downgrade() -> None:
    op.drop_table('validations')
