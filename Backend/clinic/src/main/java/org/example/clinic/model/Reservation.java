package org.example.clinic.model;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import java.time.LocalDate;

@ToString
@Getter
@Setter
@Entity
// Ensures a patient can't book twice on the same date
@Table(name = "reservation", uniqueConstraints = {@UniqueConstraint(columnNames = {"patient_id", "date"})})
public class Reservation {
    public Reservation() {}

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int turn;
    private LocalDate date;
    private String clinicName="المطرية";
    private String type;
    private String dayOfWeek;
    private boolean cancelled = false;
    private boolean success = false;
    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnoreProperties(value = {"reservations"})
    private Patient patient;
    
    @ManyToOne
    @JoinColumn(name = "company_id", nullable = true)
    @JsonIgnoreProperties(value = {"reservations"})
    private Company company;
    
    @Column(name = "papers_sent")
    private Boolean papersSent = false;
    
    @Column(name = "papers_sent_date")
    private LocalDate papersSentDate;
    
    @PrePersist
    @PreUpdate
    private void checkCancellation() {
        if (this.cancelled) {this.turn = 0;}}}
