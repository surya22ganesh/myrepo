package com.vodafone.releasex.userprofile.modal;

import lombok.Data;
import org.springframework.stereotype.Component;

@Data
@Component
public class LoginModal {

    private String userName;

    private String password;

}
