package com.civicfix.repository;

import com.civicfix.entity.Complaint;
import com.civicfix.entity.ComplaintResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ComplaintResponseRepository extends JpaRepository<ComplaintResponse, Long> {
    List<ComplaintResponse> findByComplaintOrderByCreatedAtAsc(Complaint complaint);
}
