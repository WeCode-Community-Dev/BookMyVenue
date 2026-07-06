package com.bookmyvenue.backend.service;
import com.bookmyvenue.backend.dto.authentication.RegisterRequest;
import com.bookmyvenue.backend.dto.authentication.RegisterResponse;

public interface AuthenticationService {

    RegisterResponse registerResponse(RegisterRequest registerRequest);
}
