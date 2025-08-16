package org.example.clinic.controller;

import jakarta.validation.Valid;
import org.example.clinic.model.Order;
import org.example.clinic.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
@RestController
@RequestMapping("/api/public/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {
    private final OrderService orderService;
    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }






    @CrossOrigin(origins = "http://localhost:3000") // Allow frontend to access this
    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Order> pageOrders = orderService.getAllOrders(pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("data", pageOrders.getContent());
        response.put("total", pageOrders.getTotalElements()); // For frontend pagination
        response.put("currentPage", page);
        response.put("totalPages", pageOrders.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/")
    @CrossOrigin(origins = "http://localhost:3000") // Allow frontend to access this

    public ResponseEntity<Order> addOrder(@Valid @RequestBody Order order) {
        Order savedOrder = orderService.createOrder(order);
        return ResponseEntity.ok(savedOrder);
    }
}
