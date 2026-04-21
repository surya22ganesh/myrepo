package com.vodafone.releasex.userprofile.dto;

import lombok.Data;

import java.util.List;

@Data
public class LoginResponseDto {

    private String userName;

    private String userEmail;

    private String departmentName;

    private List<String> roles;
}
