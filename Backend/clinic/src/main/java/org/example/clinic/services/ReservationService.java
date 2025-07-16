package org.example.clinic.services;
import org.example.clinic.dto.ReservationDTO;
import org.example.clinic.model.Reservation;
import org.example.clinic.repo.PatientRepository;
import org.example.clinic.repo.ReservationRepository;
import org.example.clinic.utils.ReservationMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


@Service
public class ReservationService {

//Dependency injection
    private final ReservationRepository reservationRepository;
    private final PatientRepository patientRepository;
    @Autowired
    public ReservationService(ReservationRepository reservationRepository, PatientRepository patientRepository) {this.reservationRepository = reservationRepository;
        this.patientRepository = patientRepository;
    }
//*************************************************************************************************

//Method to return list of all reservations
public List<ReservationDTO> getReservations(Long patientId, LocalDate date) {
    if (patientId != null && !patientRepository.existsById(patientId)) {throw new IllegalArgumentException("Patient ID " + patientId + " does not exist.");}
    List<Reservation> reservations;
    if (patientId != null && date != null) {reservations = reservationRepository.findByPatientIdAndDate(patientId, date);}
    else if (date != null) {reservations = reservationRepository.findByDate(date);}
    else if (patientId != null) {reservations = reservationRepository.findByPatientId(patientId);}
    else {reservations = reservationRepository.findAll();}
    return ReservationMapper.toDTOList(reservations);}


//********************************************************************************************************************************

//Method to insert new reservation and check if turn is Taken or not before create
    public void createReservation(Reservation reservation) throws Exception {
        if (hasReservationOnSameDate(reservation.getPatient().getId(), reservation.getDate())) {
            throw new Exception("المريض لديه حجز في هذا التاريخ بالفعل.");}
        if (isTurnTaken(reservation.getTurn(), reservation.getDate())) {throw new Exception("الوقت المحدد محجوز بالفعل.");}
        reservationRepository.save(reservation);}
//**********************************************************************************************************************************

//  Method to check if patient have reservation on same date
    public boolean hasReservationOnSameDate(Long patientId, LocalDate date) {
        return reservationRepository.existsByPatientIdAndDate(patientId, date);}
//***************************************************************************************************

//Check if the turn is already taken on a specific date
    public boolean isTurnTaken(int turn, LocalDate date) {
        return reservationRepository.existsByTurnAndDate(turn, date);}
//******************************************************************************************************

//Method return list of turns which is reserved on specific date
    public List<Integer> getReservedTurnsByDate(LocalDate date) {
        return reservationRepository.findReservedTurnsByDate(date);}
//*******************************************************************************************************

//Method return reservation By id
    public Optional<Reservation> findById(Long id) {
        return reservationRepository.findById(id);}
//**********************************************************************************************************

//Method to delete reservation by ID
    public void deleteById(Long id) {
        reservationRepository.deleteById(id);}
//**************************************************************************************************************

// Method to set Cancelled param to be true
    public Reservation cancelReservation(Long id) throws Exception {
        Reservation reservation = reservationRepository.findById(id).orElseThrow(() -> new Exception("Reservation not found"));
        reservation.setCancelled(true);
        reservation.setTurn(0); // Ensure turn is reset to 0
        return reservationRepository.save(reservation);}
//******************************************************************************************************************************

//Method to success param to be ture
    public Reservation successReservation(Long id) throws Exception {
        Reservation reservation = reservationRepository.findById(id).orElseThrow(() -> new Exception("Reservation not found"));
        reservation.setSuccess(true);
        return reservationRepository.save(reservation);}
//****************************************************************************************************************************

//Method o set cancelled param to be false
    public Reservation activeReservation(Long id) throws Exception {
        Reservation reservation = reservationRepository.findById(id).orElseThrow(() -> new Exception("Reservation not found"));
        reservation.setCancelled(false);
        reservation.setTurn(0); // Ensure turn is reset to 0
        return reservationRepository.save(reservation);}
//*******************************************************************************************************************************

}
