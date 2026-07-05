package com.example.bookMyVenue.Dev;

import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
                .group("public")
                .pathsToMatch(
                        "/owner/login",
                        "/owner/register",
                        "/user/login",
                        "/user/register",
                        "/api/public/**"
                )
                .build();
    }

    @Bean
    public GroupedOpenApi ownerApi() {
        return GroupedOpenApi.builder()
                .group("owner")
                .pathsToMatch("/api/owner/**")
                .build();
    }

    @Bean
    public GroupedOpenApi adminApi() {
        return GroupedOpenApi.builder()
                .group("admin")
                .pathsToMatch("/admin/login","/api/admin/**")
                .build();
    }

    @Bean
    public GroupedOpenApi userApi() {
        return GroupedOpenApi.builder()
                .group("user")
                .pathsToMatch("/api/user/**","/api/venue/**")
                .build();
    }
}
