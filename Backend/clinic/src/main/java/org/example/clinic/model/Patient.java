package org.example.clinic.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
public class Patient {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @NotBlank(message = "❌ الاسم مطلوب ولا يمكن أن يكون فارغًا!")
        @Size(min = 5, message = "❌ الاسم يجب أن يحتوي على كلمتين على الأقل!")
        private String name;

        @Column(unique = true, nullable = false)
        @NotBlank(message = "❌ رقم الهاتف مطلوب!")
        @Pattern(regexp = "^(010|011|012|015)\\d{8}$", message = "❌ رقم الهاتف يجب أن يبدأ بـ 010 أو 011 أو 012 أو 015 ويكون مكونًا من 11 رقمًا!")
        private String mobile;


        @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<Reservation> reservations;
}
