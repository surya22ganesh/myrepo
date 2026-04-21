package com.vodafone.releasex.userprofile.controller;

import com.vodafone.releasex.userprofile.dto.LoginResponseDto;
import com.vodafone.releasex.userprofile.modal.LoginModal;
import com.vodafone.releasex.userprofile.services.LoginService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/login")
public class LoginController {

    private final LoginService loginService;

    public LoginController(LoginService loginService){
        this.loginService = loginService;
    }

    @PostMapping(path = "/user")
    public ResponseEntity<LoginResponseDto> userLogin(@RequestBody LoginModal loginModal){
        System.out.println("userName : " + loginModal.getUserName());
        System.out.println("password : " + loginModal.getPassword());
        return loginService.userLogin(loginModal);
    }

}
