package com.civicfix.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "civic_inventory")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CivicInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "asset_tag", nullable = false, unique = true, length = 50)
    private String assetTag;

    @Column(nullable = false, length = 50)
    private String category; // lighting, road_repair, waste_management, water_pumps, electrical, heavy_machinery

    @Column(nullable = false, length = 100)
    private String ward;

    @Column(nullable = false, length = 100)
    private String locality;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, length = 30)
    private String unit;

    @Column(nullable = false, length = 40)
    private String status; // operational, under_maintenance, faulty, scheduled_replacement

    @Column(name = "assigned_team", nullable = false, length = 150)
    private String assignedTeam;

    @Column(name = "last_inspected")
    private LocalDate lastInspected;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.updatedAt == null) {
            this.updatedAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
