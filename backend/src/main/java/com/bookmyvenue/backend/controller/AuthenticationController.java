package com.bookmyvenue.backend.controller;
import com.bookmyvenue.backend.dto.authentication.RegisterRequest;
import com.bookmyvenue.backend.dto.authentication.RegisterResponse;
import com.bookmyvenue.backend.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @Valid @RequestBody RegisterRequest registerRequest){

        RegisterResponse registerResponse = authenticationService.registerResponse(registerRequest);

        return ResponseEntity.status(HttpStatus.CREATED).body(registerResponse);

    }
}
