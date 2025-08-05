"""add admin field to users

Revision ID: add_admin_field
Revises: add_username_change_tracking
Create Date: 2025-07-25 09:20:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_admin_field'
down_revision = 'add_username_change_tracking'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Add is_admin column to users table with default False, allowing NULL initially
    op.add_column('users', sa.Column('is_admin', sa.Boolean(), nullable=True, default=False))
    
    # Update all existing users to have is_admin = False
    op.execute("UPDATE users SET is_admin = 0 WHERE is_admin IS NULL")

def downgrade() -> None:
    # Remove is_admin column from users table
    op.drop_column('users', 'is_admin')