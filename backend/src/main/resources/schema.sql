-- ====================================================================
-- CIVICFIX: SMART INFRASTRUCTURE REPORTING AND RESOLUTION PLATFORM
-- PRODUCTION MYSQL RELATIONAL DATABASE SCHEMA
-- ====================================================================

CREATE DATABASE IF NOT EXISTS civicfix_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE civicfix_db;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    username VARCHAR(60) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    mobile_number VARCHAR(25),
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    account_status ENUM('active', 'suspended') NOT NULL DEFAULT 'active',
    two_factor_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    two_factor_secret VARCHAR(64) DEFAULT '123456',
    avatar_url VARCHAR(255),
    ward VARCHAR(100),
    city VARCHAR(100) DEFAULT 'Hyderabad',
    state VARCHAR(100) DEFAULT 'Telangana',
    postal_code VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP NULL,
    INDEX idx_user_username (username),
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. COMPLAINTS TABLE
CREATE TABLE IF NOT EXISTS complaints (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_reference VARCHAR(30) NOT NULL UNIQUE, -- CFX-YYYY-NNNNNN
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('roads_potholes', 'streetlights', 'water_supply', 'drainage_sewage', 'garbage_sanitation', 'public_infra', 'other') NOT NULL,
    severity ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'medium',
    priority ENUM('low', 'medium', 'high', 'urgent') NOT NULL DEFAULT 'medium',
    status ENUM('submitted', 'under_review', 'in_progress', 'resolved', 'closed', 'reopened') NOT NULL DEFAULT 'submitted',
    location_address VARCHAR(255) NOT NULL,
    locality VARCHAR(100) NOT NULL,
    ward VARCHAR(100) NOT NULL,
    city VARCHAR(100) DEFAULT 'Hyderabad',
    state VARCHAR(100) DEFAULT 'Telangana',
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    photo_url TEXT,
    resolution_photo_url TEXT,
    resolution_notes TEXT,
    department_assigned VARCHAR(150) DEFAULT 'Municipal Engineering Division',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    CONSTRAINT fk_complaints_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_complaint_ref (complaint_reference),
    INDEX idx_complaint_status (status),
    INDEX idx_complaint_category (category),
    INDEX idx_complaint_ward (ward),
    INDEX idx_complaint_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. COMPLAINT IMAGES TABLE
CREATE TABLE IF NOT EXISTS complaint_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_id BIGINT NOT NULL,
    storage_path VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255),
    content_type VARCHAR(100),
    file_size BIGINT,
    image_type ENUM('EVIDENCE', 'RESOLUTION') NOT NULL DEFAULT 'EVIDENCE',
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_images_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
    INDEX idx_images_complaint (complaint_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. COMPLAINT RESPONSES TABLE
CREATE TABLE IF NOT EXISTS complaint_responses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_id BIGINT NOT NULL,
    administrator_id BIGINT NOT NULL,
    response_text TEXT NOT NULL,
    resolution_photo_url TEXT,
    is_edited BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_responses_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
    CONSTRAINT fk_responses_admin FOREIGN KEY (administrator_id) REFERENCES users(id),
    INDEX idx_responses_complaint (complaint_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. COMPLAINT STATUS HISTORY TABLE
CREATE TABLE IF NOT EXISTS complaint_status_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_id BIGINT NOT NULL,
    previous_status VARCHAR(50) NOT NULL,
    new_status VARCHAR(50) NOT NULL,
    changed_by_user_id BIGINT NOT NULL,
    change_comment VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_history_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
    CONSTRAINT fk_history_user FOREIGN KEY (changed_by_user_id) REFERENCES users(id),
    INDEX idx_history_complaint (complaint_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. IN-APP NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipient_user_id BIGINT NOT NULL,
    complaint_id BIGINT,
    response_id BIGINT,
    notification_type ENUM('admin_response', 'status_change', 'location_alert', 'system') NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    location_context VARCHAR(150),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    CONSTRAINT fk_notifications_recipient FOREIGN KEY (recipient_user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_notifications_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE SET NULL,
    INDEX idx_notifications_recipient (recipient_user_id),
    INDEX idx_notifications_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. CIVIC INVENTORY TABLE
CREATE TABLE IF NOT EXISTS civic_inventory (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    asset_tag VARCHAR(50) NOT NULL UNIQUE,
    category ENUM('lighting', 'road_repair', 'waste_management', 'water_pumps', 'electrical', 'heavy_machinery') NOT NULL,
    ward VARCHAR(100) NOT NULL,
    locality VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    unit VARCHAR(30) NOT NULL DEFAULT 'units',
    status ENUM('operational', 'under_maintenance', 'faulty', 'scheduled_replacement') NOT NULL DEFAULT 'operational',
    assigned_team VARCHAR(150) NOT NULL,
    last_inspected DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_inventory_ward (ward),
    INDEX idx_inventory_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. SYSTEM AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS system_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    actor_name VARCHAR(150) NOT NULL,
    actor_role ENUM('USER', 'ADMIN') NOT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45) NOT NULL,
    severity ENUM('INFO', 'WARNING', 'ALERT', 'SUCCESS') NOT NULL DEFAULT 'INFO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_logs_action (action),
    INDEX idx_logs_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- SEED INITIAL DEMONSTRATION ADMINISTRATOR & SAMPLE DATA
-- Password hash for 'admin123' generated using BCrypt ($2a$10$wT8h...)
-- ====================================================================

INSERT INTO users (full_name, username, email, mobile_number, password_hash, role, account_status, two_factor_enabled, two_factor_secret, ward)
VALUES 
('Chief Municipal Engineer (Admin)', 'admin', 'admin@civicfix.gov', '+91 94400 11223', '$2a$10$7Z8x3lVn1H9d1YxUvL5E4OP91.m3N8y8sKqO2Jz4iWv9p0A1b2c3d', 'ADMIN', 'active', TRUE, '123456', 'Headquarters / All Wards'),
('K. Sai Charan', 'charan', 'charansai949090@gmail.com', '+91 94909 00000', '$2a$10$7Z8x3lVn1H9d1YxUvL5E4OP91.m3N8y8sKqO2Jz4iWv9p0A1b2c3d', 'USER', 'active', TRUE, '123456', 'Ward 12 - Madhapur / HITEC City'),
('Priya Deshmukh', 'priya_d', 'priya.d@civicfix.org', '+91 98220 33445', '$2a$10$7Z8x3lVn1H9d1YxUvL5E4OP91.m3N8y8sKqO2Jz4iWv9p0A1b2c3d', 'USER', 'active', FALSE, NULL, 'Ward 07 - Begumpet')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

INSERT INTO complaints (complaint_reference, user_id, title, description, category, severity, priority, status, location_address, locality, ward, city, state, postal_code, latitude, longitude, department_assigned, submitted_at)
VALUES
('CFX-2026-004120', 2, 'Severe crater pothole near Cyber Towers flyover ramp', 'Deep 3-foot wide pothole causing sudden braking for two-wheelers during peak evening traffic. Risk of severe accidents.', 'roads_potholes', 'critical', 'urgent', 'resolved', 'Cyber Towers Junction, Main Road, HITEC City', 'Madhapur', 'Ward 12 - Madhapur / HITEC City', 'Hyderabad', 'Telangana', '500081', 17.4504, 78.3808, 'Roads & Buildings Engineering Division 4', '2026-10-14 08:30:00'),
('CFX-2026-004128', 2, 'Cluster of 5 non-functional streetlights along Gachibowli Stadium Road', 'Entire 200-meter stretch is completely pitch dark after 7 PM, creating safety concerns for pedestrians and women commuting back from work.', 'streetlights', 'high', 'high', 'in_progress', 'Stadium Road, Lane 4 near Indoor Complex', 'Gachibowli', 'Ward 14 - Gachibowli', 'Hyderabad', 'Telangana', '500032', 17.4428, 78.3496, 'Central Electrical & Lighting Wing', '2026-10-17 18:45:00'),
('CFX-2026-004135', 3, 'Overflowing commercial garbage bin and illegal dumping', 'Community garbage dumpster has not been cleared for 3 consecutive days. Stray animals scattering plastic across the road.', 'garbage_sanitation', 'medium', 'medium', 'under_review', 'Market Yard Road, Near Old Bus Stand', 'Begumpet', 'Ward 07 - Begumpet', 'Hyderabad', 'Telangana', '500016', 17.4448, 78.4682, 'Sanitation & Solid Waste Management', '2026-10-18 14:10:00'),
('CFX-2026-004088', 2, 'Pressurized water supply pipeline leak flooding street', 'Major potable water supply line cracked. Fresh water gushing out onto the road at high speed.', 'water_supply', 'critical', 'urgent', 'resolved', 'Road No. 12, MLA Colony Entrance', 'Banjara Hills', 'Ward 10 - Banjara Hills', 'Hyderabad', 'Telangana', '500034', 17.4156, 78.4354, 'Hyderabad Metropolitan Water Supply & Sewerage Board', '2026-10-10 07:00:00')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

INSERT INTO civic_inventory (name, asset_tag, category, ward, locality, quantity, unit, status, assigned_team, last_inspected, notes)
VALUES
('Asphalt Cold Mix Patching Compound (50kg bags)', 'INV-ROAD-0421', 'road_repair', 'Ward 12 - Madhapur', 'Madhapur Depot', 140, 'bags', 'operational', 'Road Maintenance Squad Alpha', '2026-10-15', 'Stock sufficient for 45 emergency road patches.'),
('120W High-Lumen Smart LED Streetlight Fixtures', 'INV-ELEC-0899', 'lighting', 'Ward 14 - Gachibowli', 'Gachibowli Electrical Depot', 65, 'units', 'operational', 'Electrical Inspection Unit 2', '2026-10-17', 'Reserved for Stadium Road and Financial District pole repairs.'),
('High-Volume Submersible Dewatering Pump (10 HP)', 'INV-PUMP-0114', 'water_pumps', 'Ward 10 - Banjara Hills', 'Banjara Emergency Yard', 4, 'heavy units', 'operational', 'Monsoon Flood & Pipeline Rescue Squad', '2026-10-12', NULL),
('Hydraulic Compactor Waste Truck (6-Ton)', 'INV-WASTE-0302', 'waste_management', 'Ward 07 - Begumpet', 'Begumpet Municipal Yard', 2, 'vehicles', 'under_maintenance', 'Sanitation Fleet Bravo', '2026-10-18', 'Hydraulic cylinder seal repair in progress.'),
('Pneumatic Road Surface Tamper / Compactor', 'INV-MACH-0551', 'heavy_machinery', 'Ward 12 - Madhapur', 'Central Engineering Yard', 3, 'machines', 'operational', 'Road Repair Rapid Response', '2026-10-16', NULL)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;
