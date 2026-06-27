package com.bookmyvenue.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bookmyvenue.dto.VenueSearchDocument;
import com.bookmyvenue.model.Venues;
import com.meilisearch.sdk.Client;
import com.meilisearch.sdk.Index;
import com.meilisearch.sdk.SearchRequest;
import com.meilisearch.sdk.model.SearchResult;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import tools.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
@Slf4j
public class MeilisearchService {
    private final Client meilisearchClient;
    private final ObjectMapper objectMapper;

    private static final String INDEX_NAME = "venues";

    private Index getIndex() {
        try {
            return meilisearchClient.index(INDEX_NAME);
        } catch (Exception e) {
            log.error("Failed to get Meilisearch index", e);
            throw new RuntimeException("Meilisearch unavailable");
        }
    }

    public void indexVenue(Venues venue) {
        try {
            VenueSearchDocument doc = VenueSearchDocument.from(venue);
            String json = objectMapper.writeValueAsString(List.of(doc));
            getIndex().addDocuments(json, "id");
            log.info("Indexed venue id={} name={}", venue.getId(), venue.getVenueName());
        } catch (Exception e) {
            log.error("Failed to index venue id={}: {}", venue.getId(), e.getMessage());
        }
    }

    public void removeVenue(Integer venueId) {
        try {
            getIndex().deleteDocument(String.valueOf(venueId));
            log.info("Removed venue id={} from search index", venueId);
        } catch (Exception e) {
            log.error("Failed to remove venue id={} from index: {}", venueId, e.getMessage());
        }
    }

    public List<VenueSearchDocument> searchVenues(String query, String venueType,Integer minPrice, Integer maxPrice) {
        try {
            Index index = getIndex();

            SearchRequest searchRequest = new SearchRequest(query != null ? query : "");
            searchRequest.setLimit(20);

            // Build filter
            StringBuilder filter = new StringBuilder();
            if (venueType != null && !venueType.isEmpty()) {
                filter.append("venueType = '").append(venueType).append("'");
            }
            if (minPrice != null) {
                if (filter.length() > 0) filter.append(" AND ");
                filter.append("price >= ").append(minPrice);
            }
            if (maxPrice != null) {
                if (filter.length() > 0) filter.append(" AND ");
                filter.append("price <= ").append(maxPrice);
            }
            if (filter.length() > 0) {
                searchRequest.setFilter(new String[]{filter.toString()});
            }

            SearchResult results = (SearchResult) index.search(searchRequest);

            return results.getHits()
                    .stream()
                    .map(hit -> objectMapper.convertValue(hit, VenueSearchDocument.class))
                    .toList();

        } catch (Exception e) {
            log.error("Search failed: {}", e.getMessage());
            return List.of();
        }
    }

    // Meilisearch needs to know which fields can be filtered BEFORE filtering works
    public void configureIndex() {
        try {
            Index index = getIndex();

            index.updateFilterableAttributesSettings(
                new String[]{"venueType", "price", "capacity", "parkingAvailable", "location"}
            );

            index.updateSearchableAttributesSettings(
                new String[]{"venueName", "location", "venueDescription", "venueType"}
            );

            log.info("Meilisearch index configured successfully");
        } catch (Exception e) {
            log.error("Failed to configure Meilisearch index: {}", e.getMessage());
        }
    }
}
