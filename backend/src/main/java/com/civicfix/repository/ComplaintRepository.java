package com.civicfix.repository;

import com.civicfix.entity.Complaint;
import com.civicfix.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    Optional<Complaint> findByComplaintReference(String complaintReference);
    List<Complaint> findByReporterOrderBySubmittedAtDesc(User reporter);
    List<Complaint> findByStatus(String status);
    List<Complaint> findByCategory(String category);
    List<Complaint> findByWard(String ward);
}
