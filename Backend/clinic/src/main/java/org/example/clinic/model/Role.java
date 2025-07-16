package org.example.clinic.model;

import jakarta.persistence.*;

@Entity
public class Role {
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Id @GeneratedValue
    private Long id;
    private String name; // e.g., "ROLE_ADMIN", "ROLE_RECEPTIONIST"
}

