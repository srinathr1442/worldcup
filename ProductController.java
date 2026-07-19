package com.futbolkits.catalog.controller;

import com.futbolkits.catalog.model.Product;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * ProductController
 * -----------------------------------------------------------------------
 * NOTE ON FRAMEWORK CHOICE:
 * This uses a Spring Boot @RestController rather than a raw
 * javax/jakarta.servlet HttpServlet. Spring Boot was chosen because it:
 *   - Handles JSON (de)serialization automatically via Jackson, so
 *     returning List<Product> "just works" as a JSON array.
 *   - Gives clean, declarative routing (@GetMapping/@PostMapping) and
 *     query-param binding (@RequestParam) instead of manual
 *     request.getParameter() parsing and response.getWriter() JSON
 *     string-building that a plain Servlet would require.
 *   - Is the de-facto standard for modern Java REST APIs, making this
 *     easy to run standalone with `mvn spring-boot:run` (embedded Tomcat,
 *     no external servlet container needed).
 *
 * Endpoint:
 *   GET /api/products
 *   GET /api/products?league=World%20Cup
 *   GET /api/products?sort=asc | desc
 *   GET /api/products?league=La%20Liga&sort=desc
 * -----------------------------------------------------------------------
 */
@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*") // Dev-friendly: allows the static frontend (served from
                            // a different origin/port) to call this API.
public class ProductController {

    /**
     * In-memory mock "database". In a real application this would be
     * replaced by a repository backed by a real datastore (JPA, JDBC, etc.).
     */
    private final List<Product> products = buildMockCatalog();

    @GetMapping
    public List<Product> getProducts(
            @RequestParam(required = false) String league,
            @RequestParam(required = false) String sort) {

        List<Product> result = new ArrayList<>(products);

        // --- Optional league filter -----------------------------------
        if (league != null && !league.isBlank() && !league.equalsIgnoreCase("all")) {
            result.removeIf(p -> !p.getLeague().equalsIgnoreCase(league));
        }

        // --- Optional price sort ----------------------------------------
        if ("asc".equalsIgnoreCase(sort)) {
            result.sort(Comparator.comparingDouble(Product::getPrice));
        } else if ("desc".equalsIgnoreCase(sort)) {
            result.sort(Comparator.comparingDouble(Product::getPrice).reversed());
        }

        return result;
    }

    /**
     * Seeds the catalog with 6 iconic national-team jerseys spanning the
     * leagues/competitions the frontend filters by.
     */
    private static List<Product> buildMockCatalog() {
        List<Product> list = new ArrayList<>();

        list.add(new Product(
                "bra-2026-home", "Brazil 2026 Home", "Brazil", "World Cup",
                94.99, "/images/brazil-2026-home.jpg"));

        list.add(new Product(
                "arg-2026-home", "Argentina 2026 Home", "Argentina", "World Cup",
                94.99, "/images/argentina-2026-home.jpg"));

        list.add(new Product(
                "fra-2026-away", "France 2026 Away", "France", "World Cup",
                89.99, "/images/france-2026-away.jpg"));

        list.add(new Product(
                "ita-retro-home", "Italy Retro Home", "Italy", "Serie A",
                79.99, "/images/italy-retro-home.jpg"));

        list.add(new Product(
                "mci-2026-home", "Manchester City 2026 Home", "Manchester City", "Premier League",
                84.99, "/images/man-city-2026-home.jpg"));

        list.add(new Product(
                "rma-2026-home", "Real Madrid 2026 Home", "Real Madrid", "La Liga",
                99.99, "/images/real-madrid-2026-home.jpg"));

        return list;
    }
}
