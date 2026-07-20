package com.futbolkits.catalog.controller;

import com.futbolkits.catalog.model.CartRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * CartController
 * -----------------------------------------------------------------------
 * Mock checkout endpoint. Accepts the cart payload built by app.js and
 * responds with a success confirmation. No persistence layer or payment
 * processing is implemented here — this simply demonstrates the
 * request/response contract the frontend depends on.
 *
 * Endpoint:
 *   POST /api/cart
 *   Body: { "items": [ { "productId", "name", "price", "size", "qty" } ], "subtotal": number }
 * -----------------------------------------------------------------------
 */
@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @PostMapping
    public ResponseEntity<Map<String, Object>> submitCart(@RequestBody CartRequest cartRequest) {

        Map<String, Object> response = new LinkedHashMap<>();

        if (cartRequest.getItems() == null || cartRequest.getItems().isEmpty()) {
            response.put("status", "error");
            response.put("message", "Cart is empty — add a jersey before checking out.");
            return ResponseEntity.badRequest().body(response);
        }

        int totalItems = cartRequest.getItems().stream().mapToInt(i -> i.getQty()).sum();

        response.put("status", "success");
        response.put("message", "Order received! Thanks for supporting your team.");
        response.put("itemCount", totalItems);
        response.put("subtotal", cartRequest.getSubtotal());
        // In a real system: response.put("orderId", generatedOrderId);

        return ResponseEntity.ok(response);
    }
}
