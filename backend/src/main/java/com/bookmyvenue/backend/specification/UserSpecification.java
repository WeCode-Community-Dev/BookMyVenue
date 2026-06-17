package com.bookmyvenue.backend.specification;
import com.bookmyvenue.backend.entity.Users;
import com.bookmyvenue.backend.enums.UserStatus;
import org.springframework.data.jpa.domain.Specification;

public class UserSpecification {

    private UserSpecification() {
    }

    public static Specification<Users>
    hasKeyword(String keyword) {

        return (root, query, cb) -> {

            if (keyword == null ||
                    keyword.isBlank()) {
                return null;
            }

            String search = "%" +
                    keyword.toLowerCase() +
                    "%";

            return cb.or(
                    cb.like(
                            cb.lower(
                                    root.get("first_name")),
                            search),
                    cb.like(
                            cb.lower(
                                    root.get("email")),
                            search)
            );
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