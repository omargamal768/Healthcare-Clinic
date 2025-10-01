package org.example.clinic.repo;

import org.example.clinic.model.Order;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;


@Repository
public interface OrderRepo  extends JpaRepository<Order, Long> {
    Order findByMobileAndDate(String mobile, LocalDate date);

    Page<Order> findByActiveFalse(Pageable pageable);

    Page<Order> findByDateAndActiveFalse(LocalDate date,Pageable pageable);


}
