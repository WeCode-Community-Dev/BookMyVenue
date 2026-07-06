package com.bookmyvenue.backend.service;

import com.bookmyvenue.backend.dto.authentication.LoginRequest;
import com.bookmyvenue.backend.dto.authentication.LoginResponse;
import com.bookmyvenue.backend.dto.authentication.RegisterRequest;
import com.bookmyvenue.backend.dto.authentication.RegisterResponse;

public interface AuthenticationService {

    RegisterResponse register(RegisterRequest registerRequest);
    LoginResponse login(LoginRequest loginRequest);
}
