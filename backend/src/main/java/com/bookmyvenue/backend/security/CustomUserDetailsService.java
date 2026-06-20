package com.bookmyvenue.backend.security;

import com.bookmyvenue.backend.entity.Users;
import com.bookmyvenue.backend.enums.UserStatus;
import com.bookmyvenue.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user = userRepository.findByEmail(username).orElseThrow(() ->
                new UsernameNotFoundException("User not found"));

        if(user.getStatus()!= UserStatus.ACTIVE){
            throw new UsernameNotFoundException("User is not active");
        }

        return User.builder()
                .username(user.getEmail())
                .password(user.getPasswordHash())
                .roles(user.getRole().name())
                .build();
    }
}
