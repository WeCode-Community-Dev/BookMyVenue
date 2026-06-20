package com.bookmyvenue.backend.specification;
import com.bookmyvenue.backend.entity.Venue;
import com.bookmyvenue.backend.entity.EventCategory;
import com.bookmyvenue.backend.enums.VenueStatus;
import org.springframework.data.jpa.domain.Specification;
import java.math.BigDecimal;
import com.bookmyvenue.backend.entity.VenueAvailability;
import jakarta.persistence.criteria.Subquery;
import java.time.LocalDate;
import java.util.Set;

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
     * Filter by Venue Type
     */
    public static Specification<Venue> hasSupportedEventTypes(
            Set<Long> venueTypeIds) {

        return (root, query, cb) ->
                venueTypeIds == null || venueTypeIds.isEmpty()
                        ? cb.conjunction()
                                : root.join("supportedEventCategories")
                                        .get("eventCategoryId").in(venueTypeIds);
    }


    public static Specification<Venue> hasSupportedEventType(
            Long eventCategoryId) {

        return (root, query, cb) -> {

            if (eventCategoryId == null) {
                return cb.conjunction();
            }

            return cb.equal(
                    root.join("supportedEventCategories")
                            .get("eventCategoryId"),
                    eventCategoryId);
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
    public static Specification<Venue> hasOwner(
            Long ownerId) {

        return (root, query, cb) ->
                ownerId == null
                        ? cb.conjunction()
                        : cb.equal(
                        root.get("owner")
                                .get("userId"),
                        ownerId);
    }

    public static Specification<Venue> hasStatus(
            VenueStatus status) {

        return (root, query, cb) ->
                status == null
                        ? cb.conjunction()
                        : cb.equal(
                        root.get("status"),
                        status);
    }

}