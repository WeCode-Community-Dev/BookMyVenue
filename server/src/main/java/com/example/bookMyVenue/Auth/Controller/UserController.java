package com.example.bookMyVenue.Auth.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;
import com.example.bookMyVenue.Auth.Service.UserService;

import java.util.List;

public class UserController {

//    @Autowired
//    UserService userService;
//
//    @GetMapping("/all")
//    public ResponseEntity<List<User>> getAllUsers() {
//        return ResponseEntity.ok(userService.getAllUsers());
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<User> getUserById(@PathVariable long id) {
//        return ResponseEntity.ok(userService.getUserById(id));
//    }
//
//    @PutMapping("/{id}")
//    public ResponseEntity<String> updateUser(@PathVariable long id,
//                                             @RequestBody UserDto dto) {
//        userService.updateUser(id, dto);
//        return ResponseEntity.ok("User updated successfully!");
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<String> deleteUser(@PathVariable long id) {
//        userService.deleteUser(id);
//        return ResponseEntity.ok("User deleted successfully!");
//    }
}
