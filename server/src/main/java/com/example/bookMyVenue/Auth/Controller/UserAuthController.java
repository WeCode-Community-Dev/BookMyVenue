package com.example.bookMyVenue.Auth.Controller;


import com.example.bookMyVenue.Auth.Model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import com.example.bookMyVenue.Auth.Dto.AuthRequest;
import com.example.bookMyVenue.Auth.Dto.UserDto;
import com.example.bookMyVenue.Auth.Service.UserService;
import com.example.bookMyVenue.Auth.Util.JwtUtil;
import com.example.bookMyVenue.Enums.Role;

import static com.example.bookMyVenue.Common.APP_MSG.USER_AUTH_FAILED;
import static com.example.bookMyVenue.Common.APP_MSG.USER_REG_SUCCES;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserAuthController {
    @Autowired
    JwtUtil jwtUtil;
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    UserService userService;

    @PostMapping("/login")
    public ResponseEntity<Map<String,String>> login(@RequestBody AuthRequest request){
        try{
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(),request.getPassword()));
            User userDetails =  (User) userService.loadUserByUsername(request.getEmail());
            if(userDetails.getRole()!=Role.USER){
                throw new Exception("Authenticated user is not a venue owner");
            }
        }
        catch(Exception e){
            System.out.println(e.getMessage());
            throw new RuntimeException(USER_AUTH_FAILED,e);
        }
        String  s = jwtUtil.generateToken(request.getEmail());
        return ResponseEntity
                    .ok(Map
                        .of("token", s));
    }

   @PostMapping("/register")
   public ResponseEntity<String> register(@RequestBody UserDto dto) {
       userService.registerAppUser(dto,Role.USER);
       return ResponseEntity.ok(USER_REG_SUCCES);
   }
}
