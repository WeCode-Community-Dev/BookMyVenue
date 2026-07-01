package com.bookmyvenue;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableSpringDataWebSupport
public class BookmyvenueApplication {

	public static void main(String[] args) {
		SpringApplication.run(BookmyvenueApplication.class, args);
	}

}
