package com.vodafone.releasex.userprofile.controller;

import com.vodafone.releasex.userprofile.dto.UserTeamDetailsDto;
import com.vodafone.releasex.userprofile.entity.UserProfile;
import com.vodafone.releasex.userprofile.repository.UserProfileRepo;
import com.vodafone.releasex.userprofile.services.LoginService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RequestMapping(path = "/api/user")
@RestController
@RequiredArgsConstructor
public class TeamDetailsController {

    @Autowired
    private UserProfileRepo userProfileRepo;
    private final LoginService loginService;

    @GetMapping("/team-details")
    public List<UserTeamDetailsDto> getTeamDetails(){

        List<UserTeamDetailsDto> userTeamDetailsDtoList = new ArrayList<>();

        userProfileRepo.findAll().forEach(UserProfile -> {
            UserTeamDetailsDto userTeamDetailsDto = new UserTeamDetailsDto();

            userTeamDetailsDto.setUserEmail(UserProfile.getUserEmail());
            userTeamDetailsDto.setUserName(UserProfile.getUserName());
            userTeamDetailsDto.setDepartmentId(UserProfile.getDepartmentId());
            userTeamDetailsDto.setDepartmentName(UserProfile.getDepartmentName());

            userTeamDetailsDtoList.add(userTeamDetailsDto);
        });

        return userTeamDetailsDtoList;
    }

    @GetMapping("/user-by-email")
    public UserProfile getUserByEmail(
            @RequestParam String email) {
        return loginService.getUserByEmail(email);
    }
}
