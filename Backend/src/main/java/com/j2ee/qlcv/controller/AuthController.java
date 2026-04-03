package com.j2ee.qlcv.controller;

import com.j2ee.qlcv.dto.request.LoginRequest;
import com.j2ee.qlcv.dto.request.PasswordChangeRequest;
import com.j2ee.qlcv.dto.request.SignupRequest;
import com.j2ee.qlcv.security.services.UserDetailsImpl;
import com.j2ee.qlcv.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        return authService.authenticateUser(loginRequest);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        return authService.registerUser(signUpRequest);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@AuthenticationPrincipal UserDetailsImpl userDetails, @Valid @RequestBody PasswordChangeRequest request) {
        return authService.changePassword(request, userDetails.getId());
    }
}
