package com.civicfix.controller;

import com.civicfix.dto.ComplaintDTOs.*;
import com.civicfix.entity.*;
import com.civicfix.repository.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

    private final ComplaintRepository complaintRepository;
    private final ComplaintResponseRepository responseRepository;
    private final CivicInventoryRepository inventoryRepository;
    private final SystemLogRepository logRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @PostMapping("/complaints/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id,
                                          @Valid @RequestBody StatusUpdateRequest request,
                                          @RequestParam Long adminId) {
        Optional<Complaint> complaintOpt = complaintRepository.findById(id);
        Optional<User> adminOpt = userRepository.findById(adminId);

        if (complaintOpt.isEmpty() || adminOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Complaint or administrator not found.");
        }

        Complaint complaint = complaintOpt.get();
        User admin = adminOpt.get();

        String prevStatus = complaint.getStatus();
        complaint.setStatus(request.getNewStatus());

        if ("resolved".equalsIgnoreCase(request.getNewStatus())) {
            complaint.setResolvedAt(LocalDateTime.now());
            if (request.getResolutionPhotoUrl() != null) {
                complaint.setResolutionPhotoUrl(request.getResolutionPhotoUrl());
            }
            if (request.getResolutionNotes() != null) {
                complaint.setResolutionNotes(request.getResolutionNotes());
            }
        }

        ComplaintStatusHistory history = ComplaintStatusHistory.builder()
                .complaint(complaint)
                .previousStatus(prevStatus)
                .newStatus(request.getNewStatus())
                .changedBy(admin)
                .changeComment(request.getComment() != null ? request.getComment() : "Status changed by administrator")
                .build();
        complaint.getStatusHistory().add(history);

        complaintRepository.save(complaint);

        // Notify citizen
        Notification notif = Notification.builder()
                .recipient(complaint.getReporter())
                .complaint(complaint)
                .notificationType("status_change")
                .title("Status Updated: " + request.getNewStatus().toUpperCase())
                .message("Your report " + complaint.getComplaintReference() + " has been marked as " + request.getNewStatus())
                .locationContext(complaint.getWard())
                .build();
        notificationRepository.save(notif);

        return ResponseEntity.ok(complaint);
    }

    @PostMapping("/complaints/{id}/responses")
    public ResponseEntity<?> sendResponse(@PathVariable Long id,
                                          @Valid @RequestBody ResponseRequest request,
                                          @RequestParam Long adminId) {
        Optional<Complaint> complaintOpt = complaintRepository.findById(id);
        Optional<User> adminOpt = userRepository.findById(adminId);

        if (complaintOpt.isEmpty() || adminOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Complaint or administrator not found.");
        }

        Complaint complaint = complaintOpt.get();
        User admin = adminOpt.get();

        ComplaintResponse response = ComplaintResponse.builder()
                .complaint(complaint)
                .administrator(admin)
                .responseText(request.getResponseText())
                .resolutionPhotoUrl(request.getResolutionPhotoUrl())
                .isEdited(false)
                .build();

        ComplaintResponse saved = responseRepository.save(response);

        // Mandatory in-app notification for the citizen
        Notification notif = Notification.builder()
                .recipient(complaint.getReporter())
                .complaint(complaint)
                .responseId(saved.getId())
                .notificationType("admin_response")
                .title("📩 Official Response Received")
                .message(admin.getFullName() + " responded to " + complaint.getComplaintReference() + ": " + request.getResponseText())
                .locationContext(complaint.getWard())
                .build();
        notificationRepository.save(notif);

        return ResponseEntity.ok(saved);
    }

    @PutMapping("/complaints/{complaintId}/responses/{responseId}")
    public ResponseEntity<?> editResponse(@PathVariable Long complaintId,
                                          @PathVariable Long responseId,
                                          @RequestBody ResponseRequest request) {
        Optional<ComplaintResponse> respOpt = responseRepository.findById(responseId);
        if (respOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ComplaintResponse resp = respOpt.get();
        resp.setResponseText(request.getResponseText());
        resp.setIsEdited(true);
        responseRepository.save(resp);

        return ResponseEntity.ok(resp);
    }

    @GetMapping("/inventory")
    public ResponseEntity<?> getInventory() {
        return ResponseEntity.ok(inventoryRepository.findAll());
    }

    @PutMapping("/inventory/{id}")
    public ResponseEntity<?> updateInventory(@PathVariable Long id, @RequestBody CivicInventory updates) {
        Optional<CivicInventory> itemOpt = inventoryRepository.findById(id);
        if (itemOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        CivicInventory item = itemOpt.get();
        if (updates.getQuantity() != null) item.setQuantity(updates.getQuantity());
        if (updates.getStatus() != null) item.setStatus(updates.getStatus());
        if (updates.getAssignedTeam() != null) item.setAssignedTeam(updates.getAssignedTeam());
        if (updates.getNotes() != null) item.setNotes(updates.getNotes());

        inventoryRepository.save(item);
        return ResponseEntity.ok(item);
    }

    @GetMapping("/logs")
    public ResponseEntity<?> getLogs() {
        return ResponseEntity.ok(logRepository.findTop200ByOrderByCreatedAtDesc());
    }
}
