package com.bookmyvenue.backend.config;

import com.bookmyvenue.backend.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final CustomUserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/swagger-ui/**", "/api-docs/**", "/swagger-ui.html").permitAll()
                        // Allow Swagger UI endpoints
//                        .requestMatchers("/error","/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
                        // Allow all API endpoints
                        .requestMatchers("/api/**").permitAll()
                        // Allow actuator endpoints
                        .requestMatchers("/actuator/**").permitAll()
                        // All others requests require authentication
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider())
                .httpBasic(basic -> {});

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
