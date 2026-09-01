package com.example.bookMyVenue.Auth.Controller;

import com.example.bookMyVenue.Auth.Dto.AuthRequest;
import com.example.bookMyVenue.Auth.Model.User;
import com.example.bookMyVenue.Auth.Service.UserService;
import com.example.bookMyVenue.Auth.Util.JwtUtil;
import com.example.bookMyVenue.Enums.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import static com.example.bookMyVenue.Common.APP_MSG.USER_AUTH_FAILED;

@RestController
@RequestMapping("/admin")
public class AdminAuthController {

    @Autowired
    JwtUtil jwtUtil;
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    UserService userService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            User userDetails =  (User) userService.loadUserByUsername(request.getEmail());
            if(userDetails.getRole()!= Role.ADMIN){
                throw new Exception("Authenticated user is not an Admin");
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(USER_AUTH_FAILED);
        }

        String token = jwtUtil.generateToken(request.getEmail());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "email", request.getEmail(),
                "role", "ADMIN"
        ));
    }
}
