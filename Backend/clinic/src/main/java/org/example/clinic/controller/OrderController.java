package org.example.clinic.controller;

import jakarta.validation.Valid;
import org.example.clinic.model.Order;
import org.example.clinic.services.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;



@RestController
@RequestMapping("/api/public/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    private final OrderService orderService;
    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }






    @CrossOrigin(origins = "http://localhost:3000") // Allow frontend to access this
    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> getAllOrders(
            @RequestParam(required = false) String date,  // ⬅️ اختياري
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Order> pageOrders;

        if (date != null && !date.isEmpty()) {
            LocalDate localDate = LocalDate.parse(date); // format: yyyy-MM-dd
            pageOrders = orderService.getOrdersByDate(localDate, pageable);
        } else {
            pageOrders = orderService.getAllOrders(pageable);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("data", pageOrders.getContent());
        response.put("total", pageOrders.getTotalElements());
        response.put("currentPage", pageOrders.getNumber() + 1);
        response.put("totalPages", pageOrders.getTotalPages());

        return ResponseEntity.ok(response);
    }


    @PostMapping("/")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<Order> addOrder(@Valid @RequestBody Order order) {
        logger.info("🌍 API called: Add new order");

        try {
            Order savedOrder = orderService.createOrder(order);
            logger.info("✅ API response success for order ID: {}", savedOrder.getId());
            return ResponseEntity.ok(savedOrder);
        } catch (Exception e) {
            logger.error("❌ API failed while adding order: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/{orderId}/activate")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<Map<String, Object>> activateOrder(@PathVariable Long orderId) {
        logger.info("🌍 API called: Activate order with ID {}", orderId);

        try {
            orderService.activateOrder(orderId);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Order activated successfully!");
            response.put("orderId", orderId);

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            logger.error("⚠️ Activation failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", e.getMessage()));
        } catch (Exception e) {
            logger.error("❌ Unexpected error during activation: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("status", "error", "message", "Internal server error"));
        }
    }






}
