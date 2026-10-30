package com.civicfix;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * CivicFix - Civic Infrastructure Reporting and Resolution Platform
 * Main Spring Boot Application Entry Point
 */
@SpringBootApplication
@EnableAsync
public class CivicFixApplication {

    public static void main(String[] args) {
        SpringApplication.run(CivicFixApplication.class, args);
    }
}
