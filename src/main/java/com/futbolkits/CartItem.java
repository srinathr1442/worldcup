package com.futbolkits.catalog.model;

/**
 * CartItem
 * -----------------------------------------------------------------------
 * Represents a single line item sent from the frontend cart drawer to the
 * mock POST /api/cart endpoint.
 */
public class CartItem {

    private String productId;
    private String name;
    private double price;
    private String size;
    private int qty;

    public CartItem() {
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public int getQty() {
        return qty;
    }

    public void setQty(int qty) {
        this.qty = qty;
    }
}
