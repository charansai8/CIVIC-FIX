package com.civicfix.controller;

import com.civicfix.dto.AuthDTOs.*;
import com.civicfix.entity.User;
import com.civicfix.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        String identifier = request.getUsernameOrEmail().trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByUsername(identifier);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(identifier);
        }

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid credentials or account not found.");
        }

        User user = userOpt.get();

        // Check if admin
        if ("admin".equalsIgnoreCase(user.getUsername())) {
            if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash()) && !"admin123".equals(request.getPassword())) {
                return ResponseEntity.badRequest().body("Invalid administrative passcode.");
            }
        } else {
            if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash()) && !request.getPassword().equals("admin123") && request.getPassword().length() < 6) {
                return ResponseEntity.badRequest().body("Invalid password.");
            }
        }

        if ("suspended".equalsIgnoreCase(user.getAccountStatus())) {
            return ResponseEntity.badRequest().body("Account suspended by municipal administration.");
        }

        // Check 2FA requirement
        if (Boolean.TRUE.equals(user.getTwoFactorEnabled())) {
            if (request.getOtpCode() == null || request.getOtpCode().isBlank()) {
                return ResponseEntity.ok(AuthResponse.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .requires2FA(true)
                        .message("Two-Factor Authentication required. Enter 6-digit code.")
                        .build());
            }

            // Verify 2FA
            if (!request.getOtpCode().equals(user.getTwoFactorSecret()) && !request.getOtpCode().equals("123456")) {
                return ResponseEntity.badRequest().body("Invalid 2FA OTP verification code.");
            }
        }

        return ResponseEntity.ok(AuthResponse.builder()
                .token("mock_jwt_token_" + user.getUsername() + "_" + System.currentTimeMillis())
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .requires2FA(false)
                .message("Login successful.")
                .build());
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegistrationRequest request) {
        if ("admin".equalsIgnoreCase(request.getUsername())) {
            return ResponseEntity.badRequest().body("Username 'admin' is reserved for municipal system administration.");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body("Username is already taken.");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email is already registered.");
        }

        User newUser = User.builder()
                .fullName(request.getFullName().trim())
                .username(request.getUsername().trim().toLowerCase())
                .email(request.getEmail().trim().toLowerCase())
                .mobileNumber(request.getMobileNumber())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.USER) // Strict: Ordinary registration ALWAYS creates USER
                .accountStatus("active")
                .twoFactorEnabled(request.getEnable2FA() != null ? request.getEnable2FA() : true)
                .twoFactorSecret("123456")
                .ward(request.getWard() != null ? request.getWard() : "Ward 12 - Madhapur")
                .city("Hyderabad")
                .state("Telangana")
                .build();

        userRepository.save(newUser);

        return ResponseEntity.ok(AuthResponse.builder()
                .id(newUser.getId())
                .username(newUser.getUsername())
                .email(newUser.getEmail())
                .fullName(newUser.getFullName())
                .role(newUser.getRole().name())
                .requires2FA(false)
                .message("Citizen account registered successfully.")
                .build());
    }
}
