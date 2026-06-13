package com.example.bookMyVenue.Auth.Dto;

import com.example.bookMyVenue.Enums.Role;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class UserDto {
    private String email;
    private String password;
    private String fullName;
    private String phone;
}


