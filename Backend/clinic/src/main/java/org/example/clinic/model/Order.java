package org.example.clinic.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity

@Table(
        name = "orders",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"mobile", "date"})
        }
)

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
    @Column( nullable = false)
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

    Boolean active= false;
}
