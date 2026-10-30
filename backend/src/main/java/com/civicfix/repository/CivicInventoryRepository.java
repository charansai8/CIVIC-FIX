package com.civicfix.repository;

import com.civicfix.entity.CivicInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CivicInventoryRepository extends JpaRepository<CivicInventory, Long> {
    Optional<CivicInventory> findByAssetTag(String assetTag);
    List<CivicInventory> findByWard(String ward);
    List<CivicInventory> findByCategory(String category);
    List<CivicInventory> findByStatus(String status);
}
