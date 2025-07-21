"""add username change tracking

Revision ID: add_username_change_tracking
Revises: 
Create Date: 2024-01-20 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_username_change_tracking'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add last_username_change column to users table
    op.add_column('users', sa.Column('last_username_change', sa.DateTime(), nullable=True))


def downgrade() -> None:
    # Remove last_username_change column from users table
    op.drop_column('users', 'last_username_change')