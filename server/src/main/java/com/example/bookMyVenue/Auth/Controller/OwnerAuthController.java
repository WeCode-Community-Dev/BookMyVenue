package com.example.bookMyVenue.Auth.Controller;


import com.example.bookMyVenue.Auth.Dto.AuthRequest;
import com.example.bookMyVenue.Auth.Dto.UserDto;
import com.example.bookMyVenue.Auth.Model.User;
import com.example.bookMyVenue.Auth.Service.UserService;
import com.example.bookMyVenue.Auth.Util.JwtUtil;
import com.example.bookMyVenue.Enums.Role;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import static com.example.bookMyVenue.Common.APP_MSG.USER_AUTH_FAILED;
import static com.example.bookMyVenue.Common.APP_MSG.USER_REG_SUCCES;

@RestController
@RequestMapping("/owner")
public class OwnerAuthController {
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
            if(userDetails.getRole()!=Role.VENUE_OWNER){
                throw new Exception("Authenticated user is not a venue owner");
            }
        }
        catch(Exception e){
            System.out.println(e.getMessage());
            throw new RuntimeException(USER_AUTH_FAILED);
        }
        String  s = jwtUtil.generateToken(request.getEmail());
        return ResponseEntity
                    .ok(Map
                        .of("token", s
                        ,"email",request.getEmail()
                        ,"role","OWNER"));
    }

   @PostMapping("/register")
   public ResponseEntity<String> register(@RequestBody UserDto dto) {
       userService.registerAppUser(dto,Role.VENUE_OWNER);
       return ResponseEntity.ok(USER_REG_SUCCES);
   }
}
