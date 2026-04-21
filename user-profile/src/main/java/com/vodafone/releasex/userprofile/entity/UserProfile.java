package com.vodafone.releasex.userprofile.entity;//package com.vodafone.automation.prakash.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Entity
@Data
@Table(name = "user_profile")
@RequiredArgsConstructor
public class UserProfile {

    @Id
    private String userEmail;

    private String userName;

    private String password;

    private String departmentId;

    private String departmentName;

    private String lineManagerName;

    private String lineManagerEmail;

    private String role;

    private String msTeamsUserId;

    private String teamsId;

    private String channelId;
    private String shiftDetails;
    private String supportTeamContact;
    private String crqNumber;
    private Boolean isActive;
    private String roleIds; //roles separated by commas


}