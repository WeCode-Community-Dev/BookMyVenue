"""
Tests for the review system (service layer and API endpoints).
"""

from datetime import datetime
from uuid import uuid4

import pytest
from sqlalchemy.orm import Session

from app.core.exceptions import APIException
from app.modules.booking.models import Booking, BookingStatus
from app.modules.profile.models import Profile
from app.modules.review.models import VenueReview
from app.modules.review.schemas import ReviewCreate, ReviewUpdate
from app.modules.review.service import ReviewService
from app.modules.venue.models import Venue


class TestReviewService:
    """Tests for ReviewService business logic."""

    def test_create_review_success(
        self,
        db: Session,
        user_profile: Profile,
        venue: Venue,
        completed_booking: Booking,
    ):
        """User can create a review for their completed booking."""
        payload = ReviewCreate(rating=5, title="Excellent", comment="Great venue!")

        review = ReviewService.create_review(db, user_profile.id, venue.id, payload)

        assert review.id is not None
        assert review.rating == 5
        assert review.title == "Excellent"
        assert review.comment == "Great venue!"
        assert review.user_id == user_profile.id
        assert review.venue_id == venue.id
        assert review.is_hidden is False

        # Verify in DB
        db_review = db.query(VenueReview).filter(VenueReview.id == review.id).first()
        assert db_review is not None

    def test_create_review_no_completed_booking(
        self, db: Session, user_profile: Profile, venue: Venue
    ):
        """Cannot create review without a completed booking."""
        payload = ReviewCreate(rating=5, title="Test", comment="Test comment")

        with pytest.raises(APIException) as exc_info:
            ReviewService.create_review(db, user_profile.id, venue.id, payload)

        assert exc_info.value.status_code == 422
        assert "completed booking" in exc_info.value.detail.lower()

    def test_create_review_duplicate_prevention(
        self,
        db: Session,
        user_profile: Profile,
        venue: Venue,
        completed_booking: Booking,
    ):
        """Cannot create two reviews for the same booking."""
        payload1 = ReviewCreate(rating=5, title="First", comment="First review")
        ReviewService.create_review(db, user_profile.id, venue.id, payload1)

        payload2 = ReviewCreate(rating=4, title="Second", comment="Second review")
        with pytest.raises(APIException) as exc_info:
            ReviewService.create_review(db, user_profile.id, venue.id, payload2)

        assert exc_info.value.status_code == 422
        assert "already reviewed" in exc_info.value.detail.lower()

    def test_update_review_success(
        self, db: Session, user_profile: Profile, venue: Venue, review: VenueReview
    ):
        """User can update their own review (rating, title, comment)."""
        payload = ReviewUpdate(rating=4, title="Updated", comment="Updated comment")

        updated = ReviewService.update_review(db, user_profile.id, review.id, payload)

        assert updated.rating == 4
        assert updated.title == "Updated"
        assert updated.comment == "Updated comment"

    def test_update_review_ownership_check(
        self, db: Session, other_user: Profile, review: VenueReview
    ):
        """Cannot update review owned by another user."""
        payload = ReviewUpdate(rating=1, comment="Hack attempt")

        with pytest.raises(APIException) as exc_info:
            ReviewService.update_review(db, other_user.id, review.id, payload)

        assert exc_info.value.status_code == 403
        assert "own reviews" in exc_info.value.detail.lower()

    def test_delete_review_success(
        self, db: Session, user_profile: Profile, review: VenueReview
    ):
        """User can soft delete their own review."""
        ReviewService.delete_review(db, user_profile.id, review.id)

        # Review should still exist in DB but with deleted_at set
        db_review = db.query(VenueReview).filter(VenueReview.id == review.id).first()
        assert db_review is not None
        assert db_review.deleted_at is not None

    def test_delete_review_ownership_check(
        self, db: Session, other_user: Profile, review: VenueReview
    ):
        """Cannot delete review owned by another user."""
        with pytest.raises(APIException) as exc_info:
            ReviewService.delete_review(db, other_user.id, review.id)

        assert exc_info.value.status_code == 403

    def test_get_review_public(self, db: Session, review: VenueReview):
        """Can fetch public reviews (not hidden, not deleted)."""
        fetched = ReviewService.get_review(db, review.id)

        assert fetched.id == review.id
        assert fetched.rating == review.rating

    def test_get_review_hidden_not_found(self, db: Session, review: VenueReview):
        """Hidden reviews are not accessible via get_review."""
        review.is_hidden = True
        review.hidden_reason = "Spam"
        db.commit()

        with pytest.raises(APIException) as exc_info:
            ReviewService.get_review(db, review.id)

        assert exc_info.value.status_code == 404

    def test_get_review_deleted_not_found(self, db: Session, review: VenueReview):
        """Deleted reviews are not accessible via get_review."""
        review.deleted_at = datetime.utcnow()
        db.commit()

        with pytest.raises(APIException) as exc_info:
            ReviewService.get_review(db, review.id)

        assert exc_info.value.status_code == 404

    def test_list_venue_reviews_pagination(self, db: Session, venue: Venue):
        """Reviews are paginated and exclude deleted/hidden reviews."""
        # Create multiple reviews
        for i in range(25):
            user = Profile(id=uuid4(), email=f"user{i}@test.com", full_name=f"User {i}")
            booking = Booking(
                id=uuid4(),
                venue_id=venue.id,
                user_id=user.id,
                status=BookingStatus.completed,
                booking_type="full_day",
                starts_at=datetime.utcnow(),
                ends_at=datetime.utcnow(),
                guest_count=2,
                quoted_price_paise=10000,
                advance_pct=30,
                platform_commission_pct=10,
                advance_due_paise=3000,
                balance_due_paise=7000,
            )
            db.add(user)
            db.add(booking)
            db.flush()

            review = VenueReview(
                venue_id=venue.id,
                booking_id=booking.id,
                user_id=user.id,
                rating=5,
                comment=f"Review {i}",
            )
            db.add(review)

        db.commit()

        # Get first page
        page1 = ReviewService.list_venue_reviews(db, venue.id, page=1, per_page=10)
        assert len(page1.items) == 10
        assert page1.total == 25
        assert page1.page == 1

        # Get second page
        page2 = ReviewService.list_venue_reviews(db, venue.id, page=2, per_page=10)
        assert len(page2.items) == 10
        assert page2.page == 2

        # Get third page
        page3 = ReviewService.list_venue_reviews(db, venue.id, page=3, per_page=10)
        assert len(page3.items) == 5

    def test_list_venue_reviews_excludes_hidden_deleted(
        self, db: Session, venue: Venue, review: VenueReview
    ):
        """list_venue_reviews excludes hidden and deleted reviews."""
        # List should include our review
        result = ReviewService.list_venue_reviews(db, venue.id)
        assert len(result.items) == 1

        # Hide the review
        review.is_hidden = True
        db.commit()

        result = ReviewService.list_venue_reviews(db, venue.id)
        assert len(result.items) == 0

        # Restore and delete instead
        review.is_hidden = False
        review.deleted_at = datetime.utcnow()
        db.commit()

        result = ReviewService.list_venue_reviews(db, venue.id)
        assert len(result.items) == 0

    def test_hide_review_admin(
        self, db: Session, admin_user: Profile, review: VenueReview
    ):
        """Admin can hide a review with a reason."""
        hidden = ReviewService.hide_review(
            db, admin_user.id, review.id, reason="Offensive content"
        )

        assert hidden.is_hidden is True
        assert hidden.hidden_reason == "Offensive content"
        assert hidden.hidden_by == admin_user.id
        assert hidden.hidden_at is not None

    def test_restore_review_admin(
        self, db: Session, admin_user: Profile, review: VenueReview
    ):
        """Admin can restore a hidden review."""
        # Hide first
        ReviewService.hide_review(db, admin_user.id, review.id, reason="Test")

        # Restore
        restored = ReviewService.restore_review(db, admin_user.id, review.id)

        assert restored.is_hidden is False
        assert restored.hidden_reason is None
        assert restored.hidden_by is None
        assert restored.hidden_at is None

    def test_delete_review_admin_hard_delete(
        self, db: Session, admin_user: Profile, review: VenueReview
    ):
        """Admin hard delete is permanent."""
        review_id = review.id
        ReviewService.delete_review_admin(db, admin_user.id, review_id)
        db.commit()

        # Should not exist in DB
        remaining = db.query(VenueReview).filter(VenueReview.id == review_id).first()
        assert remaining is None

    def test_list_all_reviews_admin_filters(
        self, db: Session, venue: Venue, user_profile: Profile
    ):
        """Admin can filter reviews by venue, user, rating, hidden status."""
        # Create test reviews with different ratings
        for rating in [1, 2, 3, 4, 5]:
            user = Profile(
                id=uuid4(), email=f"user-r{rating}@test.com", full_name=f"User {rating}"
            )
            booking = Booking(
                id=uuid4(),
                venue_id=venue.id,
                user_id=user.id,
                status=BookingStatus.completed,
                booking_type="full_day",
                starts_at=datetime.utcnow(),
                ends_at=datetime.utcnow(),
                guest_count=2,
                quoted_price_paise=10000,
                advance_pct=30,
                platform_commission_pct=10,
                advance_due_paise=3000,
                balance_due_paise=7000,
            )
            db.add(user)
            db.add(booking)
            db.flush()

            review = VenueReview(
                venue_id=venue.id,
                booking_id=booking.id,
                user_id=user.id,
                rating=rating,
                comment=f"Rating {rating}",
            )
            db.add(review)

        db.commit()

        # Filter by venue
        result = ReviewService.list_all_reviews(db, venue_id=venue.id)
        assert result.total == 5

        # Filter by rating
        result = ReviewService.list_all_reviews(db, rating=5)
        assert result.total == 1
        assert result.items[0].rating == 5

        # Filter by hidden status (none hidden yet)
        result = ReviewService.list_all_reviews(db, is_hidden=False)
        assert result.total == 5

    def test_get_rating_summary_empty_venue(self, db: Session, venue: Venue):
        """Rating summary for venue with no reviews."""
        summary = ReviewService.get_rating_summary(db, venue.id)

        assert summary.average_rating == 0.0
        assert summary.total_reviews == 0
        assert summary.rating_distribution == {"1": 0, "2": 0, "3": 0, "4": 0, "5": 0}

    def test_get_rating_summary_with_reviews(
        self, db: Session, venue: Venue, user_profile: Profile
    ):
        """Rating summary calculates average and distribution correctly."""
        bookings = []
        for i in range(5):
            user = Profile(
                id=uuid4(), email=f"user-sum{i}@test.com", full_name=f"User {i}"
            )
            booking = Booking(
                id=uuid4(),
                venue_id=venue.id,
                user_id=user.id,
                status=BookingStatus.completed,
                booking_type="full_day",
                starts_at=datetime.utcnow(),
                ends_at=datetime.utcnow(),
                guest_count=2,
                quoted_price_paise=10000,
                advance_pct=30,
                platform_commission_pct=10,
                advance_due_paise=3000,
                balance_due_paise=7000,
            )
            db.add(user)
            db.add(booking)
            db.flush()
            bookings.append((user, booking))

        # Create reviews: 5 stars x3, 4 stars x2
        ratings = [5, 5, 5, 4, 4]
        for (user, booking), rating in zip(bookings, ratings):
            review = VenueReview(
                venue_id=venue.id,
                booking_id=booking.id,
                user_id=user.id,
                rating=rating,
                comment=f"Rating {rating}",
            )
            db.add(review)

        db.commit()

        summary = ReviewService.get_rating_summary(db, venue.id)

        # (5+5+5+4+4) / 5 = 4.6
        assert summary.average_rating == 4.6
        assert summary.total_reviews == 5
        assert summary.rating_distribution["5"] == 3
        assert summary.rating_distribution["4"] == 2
        assert summary.rating_distribution["3"] == 0

    def test_rating_summary_excludes_hidden_deleted(
        self, db: Session, venue: Venue, review: VenueReview
    ):
        """Rating summary only includes public reviews."""
        summary = ReviewService.get_rating_summary(db, venue.id)
        assert summary.total_reviews == 1

        # Hide the review
        review.is_hidden = True
        db.commit()

        summary = ReviewService.get_rating_summary(db, venue.id)
        assert summary.total_reviews == 0
        assert summary.average_rating == 0.0


# ─────────────────────────────────────────────────────────────────
# Fixtures
# ─────────────────────────────────────────────────────────────────


@pytest.fixture
def user_profile(db: Session) -> Profile:
    """Create a test user profile."""
    user = Profile(
        id=uuid4(),
        email="testuser@example.com",
        full_name="Test User",
    )
    db.add(user)
    db.commit()
    return user


@pytest.fixture
def other_user(db: Session) -> Profile:
    """Create another test user profile."""
    user = Profile(
        id=uuid4(),
        email="otheruser@example.com",
        full_name="Other User",
    )
    db.add(user)
    db.commit()
    return user


@pytest.fixture
def admin_user(db: Session) -> Profile:
    """Create an admin user profile."""
    from app.modules.admin.models import AdminUser

    user = Profile(
        id=uuid4(),
        email="admin@example.com",
        full_name="Admin User",
    )
    db.add(user)
    db.flush()

    admin = AdminUser(id=user.id, user_id=user.id)
    db.add(admin)
    db.commit()

    return user


@pytest.fixture
def venue(db: Session, user_profile: Profile) -> Venue:
    """Create a test venue."""
    from app.modules.venue.models import BookingMode, VenueCategory, VenueStatus

    category = VenueCategory(
        id=uuid4(),
        slug="test-category",
        label="Test Category",
        is_active=True,
    )
    db.add(category)
    db.flush()

    venue = Venue(
        id=uuid4(),
        owner_id=user_profile.id,
        name="Test Venue",
        slug="test-venue",
        category_id=category.id,
        address_line1="123 Test St",
        city="Test City",
        state="Test State",
        max_capacity=100,
        open_time="09:00:00",
        close_time="18:00:00",
        spans_next_day=False,
        allowed_booking_types=["full_day", "time_slot"],
        min_booking_duration_minutes=60,
        max_booking_duration_minutes=480,
        slot_interval_minutes=30,
        pricing_mode="flat",
        starting_price_paise=50000,
        status=VenueStatus.approved,
        booking_mode=BookingMode.MANUAL,
        is_active=True,
    )
    db.add(venue)
    db.commit()
    return venue


@pytest.fixture
def completed_booking(db: Session, user_profile: Profile, venue: Venue) -> Booking:
    """Create a completed booking for a user."""
    booking = Booking(
        id=uuid4(),
        venue_id=venue.id,
        user_id=user_profile.id,
        status=BookingStatus.completed,
        booking_type="full_day",
        starts_at=datetime.utcnow(),
        ends_at=datetime.utcnow(),
        guest_count=2,
        quoted_price_paise=50000,
        advance_pct=30,
        platform_commission_pct=10,
        advance_due_paise=15000,
        balance_due_paise=35000,
    )
    db.add(booking)
    db.commit()
    return booking


@pytest.fixture
def review(
    db: Session, user_profile: Profile, venue: Venue, completed_booking: Booking
) -> VenueReview:
    """Create a test review."""
    review = VenueReview(
        id=uuid4(),
        venue_id=venue.id,
        booking_id=completed_booking.id,
        user_id=user_profile.id,
        rating=5,
        title="Great venue!",
        comment="Excellent experience, would book again.",
    )
    db.add(review)
    db.commit()
    return review
