package com.bookmyvenue.backend.specification;
import com.bookmyvenue.backend.entity.Venue;
import org.springframework.data.jpa.domain.Specification;
import java.math.BigDecimal;
import com.bookmyvenue.backend.entity.VenueAvailability;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Subquery;
import java.time.LocalDate;

public class VenueSpecification {

    private VenueSpecification() {
    }

    public static Specification<Venue> hasCapacity(
            Integer capacity) {

        return (root, query, cb) ->
                capacity == null
                        ? null
                        : cb.greaterThanOrEqualTo(
                        root.get("capacity"),
                        capacity);
    }

    public static Specification<Venue> hasMinPrice(
            BigDecimal minPrice) {

        return (root, query, cb) ->
                minPrice == null
                        ? null
                        : cb.greaterThanOrEqualTo(
                        root.get("basePrice"),
                        minPrice);
    }

    public static Specification<Venue> hasMaxPrice(
            BigDecimal maxPrice) {

        return (root, query, cb) ->
                maxPrice == null
                        ? null
                        : cb.lessThanOrEqualTo(
                        root.get("basePrice"),
                        maxPrice);
    }

    public static Specification<Venue> hasCity(
            String city) {

        return (root, query, cb) ->
                city == null || city.isBlank()
                        ? null
                        : cb.equal(
                        cb.lower(root.get("city")),
                        city.toLowerCase());
    }

    /**
     * Filter by Venue Category
     */
    public static Specification<Venue> hasCategory(
            Long categoryId) {

        return (root, query, cb) -> {

            if (categoryId == null) {
                return null;
            }

            Join<Object, Object> categoryJoin =
                    root.join("venuCategories");

            return cb.equal(
                    categoryJoin.get("categoryId"),
                    categoryId);
        };
    }

    /**
     * Filter by Available Date
     */
    public static Specification<Venue> isAvailableOn(
            LocalDate availableDate) {

        return (root, query, cb) -> {

            if (availableDate == null) {
                return null;
            }

            Subquery<Long> subQuery =
                    query.subquery(Long.class);

            var availabilityRoot =
                    subQuery.from(VenueAvailability.class);

            subQuery.select(
                    availabilityRoot.get("venue")
                            .get("venueId"));

            subQuery.where(
                    cb.equal(
                            availabilityRoot.get("availableDate"),
                            availableDate
                    ),
                    cb.equal(
                            availabilityRoot.get("availabilityStatus"),
                            "AVAILABLE"
                    )
            );

            return root.get("venueId").in(subQuery);
        };
    }
}