package com.vodafone.releasex.userprofile.repository;

import com.vodafone.releasex.userprofile.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserProfileRepo extends JpaRepository<UserProfile, String>{

    List<UserProfile> findByDepartmentName(String departmentName);

    Optional<UserProfile> findByUserEmail(String userEmail);
}