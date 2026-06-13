package com.example.bookMyVenue.Auth.Service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.bookMyVenue.Auth.Dto.UserDto;
import com.example.bookMyVenue.Auth.Model.User;
import com.example.bookMyVenue.Auth.Repository.UserRepo;
import com.example.bookMyVenue.Auth.Util.EmailUtil;
import com.example.bookMyVenue.Enums.Role;
import com.example.bookMyVenue.Enums.UserStatus;

@Service
public class UserService implements UserDetailsService {

    @Value("${user.emailVerification.enabled}")
    private boolean isAdminEnabledEmailVerification; // NCL :later will set to Admin

    @Autowired
    UserRepo userRepo;
    
    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepo.findByUserName(email);
    }

    public User registerAppUser(UserDto userDto,Role role) {
        User newUser = UserMapping(userDto);
        checkUserExist(newUser.getUsername());
        if (isAdminEnabledEmailVerification) {
            if(EmailUtil.verifyEmail(newUser.getUsername())){
                newUser.setEmailVerified(true);
            }
        }
        newUser.setRole(role);
        newUser.setStatus(UserStatus.ACTIVE);
        return userRepo.save(newUser);
    }

    


    private void checkUserExist(String email) {
        if (userRepo.existsByUserName(email)) {
            throw new RuntimeException(email + " Already Exists");
        }
    }

    public User UserMapping(UserDto userDto) {
        return User.builder()
                .fullName(userDto.getFullName())
                .password(passwordEncoder.encode(userDto.getPassword()))
                .phone(userDto.getPhone())
                .userName(userDto.getEmail())
                .createdAt(LocalDateTime.now())
                .emailVerified(false)
                .build();

    }


}
