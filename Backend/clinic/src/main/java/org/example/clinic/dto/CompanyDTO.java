package org.example.clinic.dto;

import lombok.Getter;
import lombok.Setter;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Email;
import java.time.LocalDate;

@Getter
@Setter
public class CompanyDTO {
    private Long id;
    
    @NotBlank(message = "❌ اسم الشركة مطلوب!")
    private String name;
    
    private String description;
    
    @Email(message = "❌ البريد الإلكتروني غير صالح!")
    private String email;
    
    private String phone;
    
    private String address;
    
    private LocalDate contractStartDate;
    
    private LocalDate contractEndDate;
    
    private Boolean isActive = true;
    
    private Integer papersDeadlineDays = 30;
    
    // Statistics fields (for dashboard)
    private Long totalPatients;
    private Long patientsNeedingPapers;
}
