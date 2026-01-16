package org.example.clinic.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Email;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "companies")
public class Company {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "❌ اسم الشركة مطلوب!")
    @Column(nullable = false, unique = true)
    private String name;
    
    @Column(length = 500)
    private String description;
    
    @Email(message = "❌ البريد الإلكتروني غير صالح!")
    private String email;
    
    private String phone;
    
    private String address;
    
    @Column(name = "contract_start_date")
    private LocalDate contractStartDate;
    
    @Column(name = "contract_end_date")
    private LocalDate contractEndDate;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reservation> reservations;
    
    @Column(name = "papers_deadline_days")
    private Integer papersDeadlineDays = 30; // Default 30 days to send papers
}
