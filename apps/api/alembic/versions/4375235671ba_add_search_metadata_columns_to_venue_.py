"""add search metadata columns to venue_categories

Revision ID: 4375235671ba
Revises: fed3afac41e8
Create Date: 2026-07-02 09:36:32.341225

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = '4375235671ba'
down_revision: Union[str, None] = 'fed3afac41e8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "venue_categories",
        sa.Column("search_boost_group", sa.Text(), nullable=True),
    )
    op.add_column(
        "venue_categories",
        sa.Column("search_keywords", sa.Text(), nullable=True),
    )
 
    # Backfill from the values that used to be hardcoded in
    # category_intent.py / indexer.py / service.py, so behavior is
    # identical immediately after migration — no silent regression in
    # boost/keyword coverage.
    op.execute(
        """
        UPDATE venue_categories
        SET search_boost_group = 'wedding_hall_banquet_hall'
        WHERE slug IN ('wedding_hall', 'banquet_hall')
        """
    )
    op.execute(
        """
        UPDATE venue_categories
        SET search_boost_group = 'event_space_rooftop_resort_lawn'
        WHERE slug IN ('event_space', 'rooftop', 'resort', 'lawn')
        """
    )
 
    keyword_backfill = {
        "wedding_hall": (
            "wedding marriage reception function banquet hall mandap sadya "
            "kalyanam kalyana mandapam vivaham nikah shaadi shadi vivah "
            "engagement muhurtham sangeet mehendi haldi baraat "
            "wedding venue marriage hall wedding function hall"
        ),
        "banquet_hall": (
            "banquet hall wedding reception marriage function party hall "
            "conference hall corporate event convention hall"
        ),
        "event_space": "event space party celebration function birthday anniversary get together",
        "rooftop": "rooftop terrace open air rooftop party sundowner",
        "club": "club nightclub party lounge discotheque dj night",
        "resort": "resort destination wedding luxury staycation getaway resort wedding",
        "lawn": "lawn garden outdoor open lawn poolside function lawn",
        "auditorium": "auditorium theatre hall seminar convocation stage",
    }
    conn = op.get_bind()
    for slug, keywords in keyword_backfill.items():
        conn.execute(
            sa.text(
                "UPDATE venue_categories SET search_keywords = :kw WHERE slug = :slug"
            ),
            {"kw": keywords, "slug": slug},
        )
 
 
def downgrade() -> None:
    op.drop_column("venue_categories", "search_keywords")
    op.drop_column("venue_categories", "search_boost_group")
 
