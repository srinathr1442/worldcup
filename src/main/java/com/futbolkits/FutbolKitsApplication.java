package com.futbolkits.catalog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * FutbolKitsApplication
 * -----------------------------------------------------------------------
 * Entry point for the backend. Run with:
 *   mvn spring-boot:run
 * or package + run the jar:
 *   mvn package && java -jar target/futbolkits-catalog-0.0.1-SNAPSHOT.jar
 *
 * The embedded Tomcat server starts on http://localhost:8080 by default,
 * exposing /api/products and /api/cart as configured in the controllers.
 */
@SpringBootApplication
public class FutbolKitsApplication {

    public static void main(String[] args) {
        SpringApplication.run(FutbolKitsApplication.class, args);
    }
}
