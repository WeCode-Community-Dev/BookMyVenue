package com.example.bookMyVenue.DashBoard;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("api/owner")
@RestController
public class OwnerDashBoardController {

    @GetMapping
    public String getOwnerDashBoard(){
        return "entered inside onwer DashBoard";
    }
    @GetMapping("/hello")
     public String hello(){
        return "hello";
    }

    
}
