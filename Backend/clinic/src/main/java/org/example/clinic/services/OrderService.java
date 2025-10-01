package org.example.clinic.services;

import org.example.clinic.model.Order;
import org.example.clinic.model.Patient;
import org.example.clinic.model.Reservation;
import org.example.clinic.repo.OrderRepo;
import org.example.clinic.repo.PatientRepository;
import org.example.clinic.repo.ReservationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;



@Service
public class OrderService {
    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);
    private final OrderRepo orderRepo;
    final  PatientRepository patientRepository;
    final ReservationRepository reservationRepository;
    public OrderService(OrderRepo orderRepo, PatientRepository patientRepository, ReservationRepository reservationRepository) {
        this.orderRepo = orderRepo;
        this.patientRepository = patientRepository;
        this.reservationRepository = reservationRepository;
    }
    public Page<Order> getAllOrders(Pageable pageable) {
        return orderRepo.findByActiveFalse(pageable);
    }
    public Order createOrder(Order order) {
        logger.debug("📥 Saving order details: {}", order);

        if (order.getName() == null || order.getName().isEmpty()) {
            throw new IllegalArgumentException("Order name cannot be empty!");
        }

        // New logic: Check for existing orders with the same mobile and date.
        Order existingOrder = orderRepo.findByMobileAndDate(order.getMobile(), order.getDate());
        if (existingOrder != null) {
            logger.warn("⚠️ An order for mobile {} on date {} already exists. Skipping insertion.", order.getMobile(), order.getDate());
            return null; // or return existingOrder, depending on your desired behavior
        }

        Order savedOrder = orderRepo.save(order);
        logger.info("✅ Order persisted with ID: {}", savedOrder.getId());
        return savedOrder;
    }
//here want to make method to activate order by make new patient and new reservation for this order when press activate do this
@Transactional
public void activateOrder(Long orderId) {
    Order order = orderRepo.findById(orderId)
            .orElseThrow(() -> new IllegalArgumentException("❌ Order not found with ID: " + orderId));

    logger.info("🚀 Activating order with ID: {}", orderId);

    // 1️⃣ Find an existing patient by mobile or create a new one
    Patient patient = patientRepository.findByMobile(order.getMobile())
            .orElseGet(() -> {
                Patient newPatient = new Patient();
                newPatient.setName(order.getName());
                newPatient.setMobile(order.getMobile());
                Patient savedPatient = patientRepository.save(newPatient);
                logger.info("✅ New patient created with ID: {}", savedPatient.getId());
                return savedPatient;
            });

    logger.info("✅ Patient to be linked: ID {}, Name: {}", patient.getId(), patient.getName());

    // 2️⃣ Get all reserved turns for that date
    List<Integer> reservedTurns = reservationRepository.findReservedTurnsByDate(order.getDate());
    logger.info("📌 Reserved turns for {}: {}", order.getDate(), reservedTurns);

    // 3️⃣ Generate list from 1 → 30
    List<Integer> allTurns = new ArrayList<>();
    for (int i = 1; i <= 30; i++) {
        allTurns.add(i);
    }

    // 4️⃣ Remove reserved ones → available turns
    List<Integer> availableTurns = new ArrayList<>(allTurns);
    availableTurns.removeAll(reservedTurns);

    logger.info("✅ Available turns for {}: {}", order.getDate(), availableTurns);

    if (availableTurns.isEmpty()) {
        throw new IllegalStateException("❌ No available turns for date: " + order.getDate());
    }

    // 5️⃣ Select first available turn
    int turn = availableTurns.get(0);

    // 6️⃣ Create Reservation for the patient
    Reservation reservation = new Reservation();
    reservation.setPatient(patient);
    reservation.setDate(order.getDate());
    reservation.setTurn(turn);

    reservationRepository.save(reservation);

    // 7️⃣ Update order → active = true
    order.setActive(true);
    orderRepo.save(order);

    logger.info("✅ Order {} activated. Patient {} linked to Reservation with turn {}. Order active set to TRUE.",
            orderId, patient.getId(), turn);
}

    public Page<Order> getOrdersByDate(LocalDate date, Pageable pageable) {
        return orderRepo.findByDateAndActiveFalse(date, pageable);
    }




}

