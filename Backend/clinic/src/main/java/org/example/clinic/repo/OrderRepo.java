package org.example.clinic.repo;

import org.example.clinic.model.Order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepo  extends JpaRepository<Order, Long> {

}
