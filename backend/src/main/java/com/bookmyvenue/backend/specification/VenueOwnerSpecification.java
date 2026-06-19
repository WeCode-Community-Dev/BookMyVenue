package com.bookmyvenue.backend.specification;

import com.bookmyvenue.backend.entity.Users;
import com.bookmyvenue.backend.enums.UserStatus;
import org.springframework.data.jpa.domain.Specification;

public class VenueOwnerSpecification {

    private VenueOwnerSpecification() {
    }

    public static Specification<Users>
    hasName(String name) {

        return (root, query, cb) -> {

            if (name == null ||
                    name.isBlank()) {
                return null;
            }

            String search = "%" +
                    name.toLowerCase() +
                    "%";

            return cb.like(
                    cb.lower(
                            root.get("firstName")),
                    search);
        };
    }

    public static Specification<Users>
    hasEmail(String email) {

        return (root, query, cb) -> {

            if (email == null ||
                    email.isBlank()) {
                return null;
            }

            String search = "%" +
                    email.toLowerCase() +
                    "%";

            return cb.like(
                    cb.lower(
                            root.get("email")),
                    search);
        };
    }

    public static Specification<Users>
    hasStatus(UserStatus status) {

        return (root, query, cb) ->
                status == null
                        ? null
                        : cb.equal(
                        root.get("status"),
                        status);
    }
}

