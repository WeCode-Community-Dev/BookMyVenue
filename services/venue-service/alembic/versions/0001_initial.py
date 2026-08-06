"""initial venue schema

Revision ID: 0001_initial
Revises:
Create Date: 2026-07-19 14:00:00.000000

"""

from typing import Sequence, Union

import geoalchemy2
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "0001_initial"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "districts",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name"),
    )

    op.create_table(
        "venue_categories",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("icon_url", sa.Text(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name"),
    )

    op.create_table(
        "cities",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("district_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column(
            "location",
            geoalchemy2.types.Geometry(
                geometry_type="POINT",
                srid=4326,
                from_text="ST_GeomFromEWKT",
                name="geometry",
            ),
            nullable=True,
        ),
        sa.ForeignKeyConstraint(["district_id"], ["districts.id"], ondelete="RESTRICT"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("district_id", "name", name="uq_cities_district_name"),
    )
    op.create_index("ix_cities_district_id", "cities", ["district_id"])
    op.create_index(
        "ix_cities_location",
        "cities",
        ["location"],
        postgresql_using="gist",
    )

    op.create_table(
        "venues",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("owner_id", sa.Integer(), nullable=False),
        sa.Column("category_id", sa.Integer(), nullable=False),
        sa.Column("city_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("slug", sa.String(length=220), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("address", sa.Text(), nullable=False),
        sa.Column("google_maps_url", sa.String(length=500), nullable=True),
        sa.Column("capacity", sa.Integer(), nullable=False),
        sa.Column("contact_name", sa.String(length=100), nullable=False),
        sa.Column("contact_phone", sa.String(length=20), nullable=False),
        sa.Column("contact_email", sa.String(length=255), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column(
            "amenities",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=False,
        ),
        sa.Column("booking_type", sa.String(length=20), nullable=False),
        sa.Column("average_rating", sa.Numeric(precision=2, scale=1), nullable=False),
        sa.Column("review_count", sa.Integer(), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.CheckConstraint("capacity > 0", name="ck_venues_capacity_positive"),
        sa.CheckConstraint(
            "average_rating >= 0 AND average_rating <= 5",
            name="ck_venues_average_rating_range",
        ),
        sa.ForeignKeyConstraint(
            ["category_id"],
            ["venue_categories.id"],
            ondelete="RESTRICT",
        ),
        sa.ForeignKeyConstraint(["city_id"], ["cities.id"], ondelete="RESTRICT"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("slug"),
    )
    op.create_index("ix_venues_slug", "venues", ["slug"])
    op.create_index("ix_venues_owner_id", "venues", ["owner_id"])
    op.create_index("ix_venues_category_id", "venues", ["category_id"])
    op.create_index("ix_venues_city_id", "venues", ["city_id"])
    op.create_index("ix_venues_status", "venues", ["status"])
    op.create_index("ix_venues_category_status", "venues", ["category_id", "status"])
    op.create_index("ix_venues_city_status", "venues", ["city_id", "status"])
    op.create_index(
        "ix_venues_name_trgm",
        "venues",
        ["name"],
        postgresql_using="gin",
        postgresql_ops={"name": "gin_trgm_ops"},
    )

    op.create_table(
        "venue_images",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("venue_id", sa.Integer(), nullable=False),
        sa.Column("image_url", sa.Text(), nullable=False),
        sa.Column("is_cover", sa.Boolean(), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.Column(
            "uploaded_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["venue_id"], ["venues.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_venue_images_venue_id", "venue_images", ["venue_id"])
    op.create_index(
        "ix_venue_images_venue_sort",
        "venue_images",
        ["venue_id", "sort_order"],
    )

    op.create_table(
        "venue_schedule_groups",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("venue_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["venue_id"], ["venues.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "venue_schedule_group_days",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("group_id", sa.Integer(), nullable=False),
        sa.Column("day_of_week", sa.Integer(), nullable=False),
        sa.CheckConstraint(
            "day_of_week >= 0 AND day_of_week <= 6",
            name="ck_day_of_week",
        ),
        sa.ForeignKeyConstraint(
            ["group_id"],
            ["venue_schedule_groups.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("group_id", "day_of_week", name="uq_group_day"),
    )

    op.create_table(
        "venue_schedules",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("group_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=True),
        sa.Column("start_time", sa.Time(), nullable=False),
        sa.Column("end_time", sa.Time(), nullable=False),
        sa.Column("price", sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column("is_available", sa.Boolean(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.CheckConstraint("end_time > start_time", name="ck_schedule_time_range"),
        sa.CheckConstraint("price >= 0", name="ck_schedule_price"),
        sa.ForeignKeyConstraint(
            ["group_id"],
            ["venue_schedule_groups.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "group_id",
            "start_time",
            "end_time",
            name="uq_schedule_slot",
        ),
    )

    op.create_table(
        "venue_schedule_overrides",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("venue_id", sa.Integer(), nullable=False),
        sa.Column("override_date", sa.Date(), nullable=False),
        sa.Column("start_time", sa.Time(), nullable=True),
        sa.Column("end_time", sa.Time(), nullable=True),
        sa.Column("is_available", sa.Boolean(), nullable=False),
        sa.Column("reason", sa.String(length=255), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["venue_id"], ["venues.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_sched_override_venue", "venue_schedule_overrides", ["venue_id"])
    op.create_index(
        "ix_sched_override_date",
        "venue_schedule_overrides",
        ["override_date"],
    )


def downgrade() -> None:
    op.drop_index("ix_sched_override_date", table_name="venue_schedule_overrides")
    op.drop_index("ix_sched_override_venue", table_name="venue_schedule_overrides")
    op.drop_table("venue_schedule_overrides")
    op.drop_table("venue_schedules")
    op.drop_table("venue_schedule_group_days")
    op.drop_table("venue_schedule_groups")
    op.drop_index("ix_venue_images_venue_sort", table_name="venue_images")
    op.drop_index("ix_venue_images_venue_id", table_name="venue_images")
    op.drop_table("venue_images")
    op.drop_index("ix_venues_name_trgm", table_name="venues")
    op.drop_index("ix_venues_city_status", table_name="venues")
    op.drop_index("ix_venues_category_status", table_name="venues")
    op.drop_index("ix_venues_status", table_name="venues")
    op.drop_index("ix_venues_city_id", table_name="venues")
    op.drop_index("ix_venues_category_id", table_name="venues")
    op.drop_index("ix_venues_owner_id", table_name="venues")
    op.drop_index("ix_venues_slug", table_name="venues")
    op.drop_table("venues")
    op.drop_index("ix_cities_location", table_name="cities")
    op.drop_index("ix_cities_district_id", table_name="cities")
    op.drop_table("cities")
    op.drop_table("venue_categories")
    op.drop_table("districts")
