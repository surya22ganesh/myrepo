package com.vodafone.releasex.userprofile.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name="roles")
@Data
@RequiredArgsConstructor
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roleId;

    private String roleName;

    private Boolean isActive;

    private String createdBy;

    private LocalDateTime createdDate;

}

