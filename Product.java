package com.futbolkits.catalog.model;

/**
 * Product
 * -----------------------------------------------------------------------
 * Plain data model representing a single jersey in the catalog.
 * Kept as a simple POJO with getters/setters so Spring's built-in Jackson
 * integration can serialize/deserialize it to/from JSON with zero extra
 * configuration.
 */
public class Product {

    private String id;
    private String name;     // Display name, e.g. "Argentina 2026 Home"
    private String team;     // e.g. "Argentina"
    private String league;   // e.g. "World Cup", "Premier League", "La Liga"
    private double price;    // USD
    private String imageUrl; // Placeholder or CDN path to jersey image

    public Product() {
        // Empty constructor required for JSON deserialization frameworks.
    }

    public Product(String id, String name, String team, String league, double price, String imageUrl) {
        this.id = id;
        this.name = name;
        this.team = team;
        this.league = league;
        this.price = price;
        this.imageUrl = imageUrl;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTeam() {
        return team;
    }

    public void setTeam(String team) {
        this.team = team;
    }

    public String getLeague() {
        return league;
    }

    public void setLeague(String league) {
        this.league = league;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
