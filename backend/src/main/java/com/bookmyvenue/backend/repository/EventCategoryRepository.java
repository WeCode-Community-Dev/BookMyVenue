package com.bookmyvenue.backend.repository;

import com.bookmyvenue.backend.entity.EventCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EventCategoryRepository extends JpaRepository<EventCategory, Long> {
    Optional<EventCategory> findByEventCategoryName(String name);
}

