package com.vodafone.releasex.userprofile.controller;

import com.vodafone.releasex.userprofile.dto.RotaDetailsDto;
import com.vodafone.releasex.userprofile.feign.CrqFeignInterface;
import com.vodafone.releasex.userprofile.services.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping(path = "/api/user-profile")
public class UserProfileController {

    @Autowired
    private LoginService loginService;

    @PostMapping("/save-from-rota")
    public ResponseEntity<String> saveUsersFromRota(
            @RequestBody List<RotaDetailsDto> rotaList,
            @RequestParam String crqNumber) {

        loginService.saveUsersFromRota(rotaList, crqNumber);
        return ResponseEntity.ok("Users saved successfully from ROTA");
    }




}
 