package com.bookmyvenue.server.user.service;

import com.bookmyvenue.server.user.dto.response.UserProfileResponse;

public interface UserService {

    UserProfileResponse getCurrentUserProfile();

}