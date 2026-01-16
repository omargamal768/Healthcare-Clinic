package org.example.clinic.controller;// AuthController.java
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.example.clinic.security.JwtUtil;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private static final Logger logger = LogManager.getLogger(AuthController.class);
    
    private final JwtUtil jwtUtil;

    public AuthController(JwtUtil jwtUtil, PasswordEncoder encoder) {
        this.jwtUtil = jwtUtil;
        logger.info("AuthController initialized");
    }

    // Simulate user database (replace with real DB later)
    private final Map<String, String> users = new HashMap<String, String>() {{
        put("admin", "admin123");
        put("receptionist", "reception123");
    }};

    private final Map<String, String> roles = new HashMap<String, String>() {{
        put("admin", "admin");
        put("receptionist", "receptionist");
    }};

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        logger.trace("POST /api/auth/login - Login attempt for username: {}", username);

        try {
            String password = credentials.get("password");

            if (users.containsKey(username) && users.get(username).equals(password)) {
                String role = roles.get(username);
                logger.debug("Valid credentials for user: {}, role: {}", username, role);
                
                String token = jwtUtil.generateToken(username, role);
                Map<String, String> response = new HashMap<>();
                response.put("token", token);
                response.put("role", role);
                
                logger.info("Login successful for user: {}, role: {}", username, role);
                logger.trace("POST /api/auth/login - Response: token generated for user {}", username);
                return response;
            }

            logger.warn("Invalid login attempt for username: {}", username);
            throw new RuntimeException("Invalid credentials");
        } catch (Exception e) {
            logger.error("Error during login for username: {}", username, e);
            throw e;
        }
    }
}
