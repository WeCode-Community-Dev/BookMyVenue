package com.bookmyvenue.server.auth.security;

import com.bookmyvenue.server.user.enums.Role;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

/**
 * Custom authenticated user object stored in Spring Security's SecurityContext.
 * Holds the user's identity and role information after successful authentication.
 * Inorder to avoid the repeated db check.
 */
@Getter
@RequiredArgsConstructor
public class CustomUserPrincipal implements UserDetails {

    private final UUID id;
    private final String email;
    private final String password;
    private final Role role;

    // Returns the user's role as a Spring Security authority
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(
                new SimpleGrantedAuthority("ROLE_" + role.name())
        );
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }
}