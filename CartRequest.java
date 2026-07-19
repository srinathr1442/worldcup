package com.futbolkits.catalog.model;

import java.util.List;

/**
 * CartRequest
 * -----------------------------------------------------------------------
 * Maps the JSON body posted by app.js to POST /api/cart:
 *   { "items": [ {...CartItem}, ... ], "subtotal": 189.98 }
 */
public class CartRequest {

    private List<CartItem> items;
    private double subtotal;

    public CartRequest() {
    }

    public List<CartItem> getItems() {
        return items;
    }

    public void setItems(List<CartItem> items) {
        this.items = items;
    }

    public double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(double subtotal) {
        this.subtotal = subtotal;
    }
}
