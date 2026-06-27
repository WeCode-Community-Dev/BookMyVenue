package com.bookmyvenue.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.stereotype.Component;

import com.bookmyvenue.service.MeilisearchService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class MeilisearchIndexInitializer {
    private final MeilisearchService meilisearchService;

    public void run(ApplicationArguments args){
        log.info("Configuring Meilisearch index");
        meilisearchService.configureIndex();
    }
}
