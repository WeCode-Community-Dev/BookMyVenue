package com.bookmyvenue.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfiguration {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .addServersItem(new Server()
                        .url("http://localhost:8080")
                        .description("Local Development Server"))
                .info(new Info()
                        .title("BookMyVenue API")
                        .version("1.0.0")
                        .description("Comprehensive API documentation for BookMyVenue backend application. " +
                                "This API provides endpoints for managing venue categories, bookings, and related operations.")
                        .contact(new Contact()
                                .name("BookMyVenue Team")
                                .email("support@bookmyvenue.com")
                                .url("https://www.bookmyvenue.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0.html")));
    }
}
