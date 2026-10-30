package com.civicfix.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "complaints")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "complaint_reference", nullable = false, unique = true, length = 30)
    private String complaintReference;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User reporter;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 50)
    private String category; // roads_potholes, streetlights, water_supply, etc.

    @Column(nullable = false, length = 20)
    private String severity; // low, medium, high, critical

    @Column(nullable = false, length = 20)
    private String priority; // low, medium, high, urgent

    @Column(nullable = false, length = 30)
    private String status; // submitted, under_review, in_progress, resolved, closed, reopened

    @Column(name = "location_address", nullable = false)
    private String locationAddress;

    @Column(nullable = false, length = 100)
    private String locality;

    @Column(nullable = false, length = 100)
    private String ward;

    private String city;
    private String state;

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    private BigDecimal latitude;
    private BigDecimal longitude;

    @Column(name = "photo_url", columnDefinition = "TEXT")
    private String photoUrl;

    @Column(name = "resolution_photo_url", columnDefinition = "TEXT")
    private String resolutionPhotoUrl;

    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;

    @Column(name = "department_assigned")
    private String departmentAssigned;

    @Column(name = "submitted_at", updatable = false)
    private LocalDateTime submittedAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @OneToMany(mappedBy = "complaint", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ComplaintResponse> responses = new ArrayList<>();

    @OneToMany(mappedBy = "complaint", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ComplaintStatusHistory> statusHistory = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (this.submittedAt == null) {
            this.submittedAt = LocalDateTime.now();
        }
        if (this.updatedAt == null) {
            this.updatedAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = "submitted";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
