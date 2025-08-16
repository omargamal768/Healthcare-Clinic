package org.example.clinic.services;


import org.example.clinic.model.Order;
import org.example.clinic.repo.OrderRepo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;



@Service
public class OrderService {

    private final OrderRepo orderRepo;

    public OrderService( OrderRepo orderRepo) {
        this.orderRepo = orderRepo;}


    public Page<Order> getAllOrders(Pageable pageable) {
        return orderRepo.findAll(pageable);
    }

    public Order createOrder(Order order) {
        return orderRepo.save(order);
    }

    }

