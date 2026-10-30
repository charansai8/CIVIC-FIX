package com.civicfix.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.math.BigDecimal;

public class ComplaintDTOs {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateComplaintRequest {
        @NotBlank(message = "Title is required")
        private String title;

        @NotBlank(message = "Description is required")
        private String description;

        @NotBlank(message = "Category is required")
        private String category;

        private String severity; // low, medium, high, critical
        private String priority; // low, medium, high, urgent

        @NotBlank(message = "Location address is required")
        private String locationAddress;

        private String locality;
        private String ward;
        private String city;
        private String state;
        private String postalCode;
        private BigDecimal latitude;
        private BigDecimal longitude;
        private String photoUrl;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatusUpdateRequest {
        @NotBlank(message = "New status is required")
        private String newStatus;

        private String comment;
        private String resolutionPhotoUrl;
        private String resolutionNotes;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResponseRequest {
        @NotBlank(message = "Response text cannot be empty")
        private String responseText;

        private String resolutionPhotoUrl;
    }
}
