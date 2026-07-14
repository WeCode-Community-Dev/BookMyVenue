package com.bookmyvenue.backend.specification;

import com.bookmyvenue.backend.entity.Venue;
import com.bookmyvenue.backend.enums.VenueStatus;
import org.springframework.data.jpa.domain.Specification;

public class AdminRequestSpecification {

    private AdminRequestSpecification() {
    }

    public static Specification<Venue>
    hasVenueName(String venueName) {

        return (root, query, cb) -> {

            if (venueName == null ||
                    venueName.isBlank()) {
                return null;
            }

            return cb.like(
                    cb.lower(root.get("venueName")),
                    "%" +
                            venueName.toLowerCase() +
                            "%");
        };
    }

    public static Specification<Venue>
    hasStatus(
            VenueStatus status) {

        return (root, query, cb) ->
                status == null
                        ? null
                        : cb.equal(
                        root.get("status"),
                        status);
    }

    public static Specification<Venue>
    hasOwner(
            Long ownerId) {

        return (root, query, cb) ->
                ownerId == null
                        ? null
                        : cb.equal(
                        root.get("ownerUser")
                                .get("userId"),
                        ownerId);
    }
}