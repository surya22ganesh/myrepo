package com.vodafone.releasex.userprofile.dto;

import lombok.Data;
import org.springframework.stereotype.Component;

@Component
@Data
public class LoginDto {
    private String userName;
    private String userEmail;
    private String role;
    private String departmentName;
}
