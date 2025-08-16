package org.example.clinic.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @NotBlank(message = "❌ الاسم مطلوب ولا يمكن أن يكون فارغًا!")
    @Pattern(
            regexp = "^(\\S+\\s+\\S+).*$",
            message = "❌ الاسم يجب أن يحتوي على كلمتين على الأقل!"
    )
    String name;

    @Column(unique = true, nullable = false)
    @NotBlank(message = "❌ رقم الهاتف مطلوب!")
    @Pattern(
            regexp = "^(010|011|012|015)\\d{8}$",
            message = "❌ رقم الهاتف يجب أن يبدأ بـ 010 أو 011 أو 012 أو 015 ويكون مكونًا من 11 رقمًا!"
    )
    String mobile;

    @Email(message = "❌ البريد الإلكتروني غير صالح!")
    String email;

    @NotNull(message = "❌ التاريخ مطلوب!")
    @FutureOrPresent(message = "❌ التاريخ يجب أن يكون اليوم أو في المستقبل فقط!")
    LocalDate date;
}
