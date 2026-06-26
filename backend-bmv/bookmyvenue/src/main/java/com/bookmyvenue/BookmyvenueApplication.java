package com.bookmyvenue;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BookmyvenueApplication {

	public static void main(String[] args) {
		SpringApplication.run(BookmyvenueApplication.class, args);
	}

}
