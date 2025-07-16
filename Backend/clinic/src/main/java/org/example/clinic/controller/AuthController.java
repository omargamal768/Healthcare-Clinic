package org.example.clinic.controller;// AuthController.java
import org.example.clinic.security.JwtUtil;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final JwtUtil jwtUtil;

    public AuthController(JwtUtil jwtUtil, PasswordEncoder encoder) {
        this.jwtUtil = jwtUtil;
    }

    // Simulate user database (replace with real DB later)
    private final Map<String, String> users = Map.of(
            "admin", "admin123",
            "receptionist", "reception123"
    );

    private final Map<String, String> roles = Map.of(
            "admin", "admin",
            "receptionist", "receptionist"
    );

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        if (users.containsKey(username) && users.get(username).equals(password)) {
            String role = roles.get(username);
            String token = jwtUtil.generateToken(username, role);
            return Map.of("token", token, "role", role);
        }

        throw new RuntimeException("Invalid credentials");
    }
}
