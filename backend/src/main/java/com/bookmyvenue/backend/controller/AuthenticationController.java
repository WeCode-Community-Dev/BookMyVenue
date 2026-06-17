package com.bookmyvenue.backend.controller;
import com.bookmyvenue.backend.dto.authentication.LoginRequest;
import com.bookmyvenue.backend.dto.authentication.LoginResponse;
import com.bookmyvenue.backend.dto.authentication.RegisterRequest;
import com.bookmyvenue.backend.dto.authentication.RegisterResponse;
import com.bookmyvenue.backend.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @Valid @RequestBody RegisterRequest registerRequest){

        RegisterResponse registerResponse = authenticationService.register(registerRequest);

        return ResponseEntity.status(HttpStatus.CREATED).body(registerResponse);

    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest loginRequest){
        LoginResponse loginResponse = authenticationService.login(loginRequest);
        return ResponseEntity.status(HttpStatus.OK).body(loginResponse);
    }
}
