package com.vodafone.releasex.userprofile.repository;

import com.vodafone.releasex.userprofile.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRoleRepo extends JpaRepository<Role, Long> {

    Optional<Role> findByRoleName(String roleName);

}