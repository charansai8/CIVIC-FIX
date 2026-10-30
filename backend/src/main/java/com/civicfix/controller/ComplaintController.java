package com.civicfix.controller;

import com.civicfix.dto.ComplaintDTOs.*;
import com.civicfix.entity.Complaint;
import com.civicfix.entity.ComplaintStatusHistory;
import com.civicfix.entity.Notification;
import com.civicfix.entity.User;
import com.civicfix.repository.ComplaintRepository;
import com.civicfix.repository.NotificationRepository;
import com.civicfix.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ComplaintController {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    @GetMapping
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        return ResponseEntity.ok(complaintRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getComplaintById(@PathVariable Long id) {
        Optional<Complaint> complaintOpt = complaintRepository.findById(id);
        return complaintOpt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createComplaint(@Valid @RequestBody CreateComplaintRequest request,
                                            @RequestParam Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found.");
        }

        User user = userOpt.get();
        String refNo = "CFX-" + LocalDateTime.now().getYear() + "-" + (int)(100000 + Math.random() * 900000);

        Complaint complaint = Complaint.builder()
                .complaintReference(refNo)
                .reporter(user)
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .severity(request.getSeverity() != null ? request.getSeverity() : "medium")
                .priority(request.getPriority() != null ? request.getPriority() : "medium")
                .status("submitted")
                .locationAddress(request.getLocationAddress())
                .locality(request.getLocality() != null ? request.getLocality() : "Central")
                .ward(request.getWard() != null ? request.getWard() : user.getWard())
                .city(request.getCity() != null ? request.getCity() : user.getCity())
                .state(request.getState() != null ? request.getState() : user.getState())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .photoUrl(request.getPhotoUrl())
                .departmentAssigned("Municipal Public Works Division")
                .build();

        ComplaintStatusHistory initialHistory = ComplaintStatusHistory.builder()
                .complaint(complaint)
                .previousStatus("submitted")
                .newStatus("submitted")
                .changedBy(user)
                .changeComment("Complaint submitted by citizen with photographic evidence.")
                .build();

        complaint.getStatusHistory().add(initialHistory);
        Complaint saved = complaintRepository.save(complaint);

        // System notification
        Notification notif = Notification.builder()
                .recipient(user)
                .complaint(saved)
                .notificationType("system")
                .title("Complaint Logged Successfully")
                .message("Your report " + saved.getTitle() + " has been assigned reference ID " + saved.getComplaintReference())
                .build();
        notificationRepository.save(notif);

        return ResponseEntity.ok(saved);
    }
}
