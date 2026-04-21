package com.vodafone.releasex.userprofile.services;

import com.vodafone.releasex.userprofile.dto.LoginDto;
import com.vodafone.releasex.userprofile.dto.LoginResponseDto;
import com.vodafone.releasex.userprofile.dto.RotaDetailsDto;
import com.vodafone.releasex.userprofile.entity.Role;
import com.vodafone.releasex.userprofile.entity.UserProfile;
import com.vodafone.releasex.userprofile.feign.CrqFeignInterface;
import com.vodafone.releasex.userprofile.modal.LoginModal;
import com.vodafone.releasex.userprofile.repository.UserProfileRepo;
import com.vodafone.releasex.userprofile.repository.UserRoleRepo;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class LoginService {

    private final UserProfileRepo userProfileRepo;
    private final LoginDto loginDto;
    private final CrqFeignInterface crqFeignInterface;
    private final UserRoleRepo userRoleRepo;


    public LoginService(UserProfileRepo userProfileRepo, LoginDto loginDto, CrqFeignInterface crqFeignInterface, UserRoleRepo userRoleRepo) {
        this.userProfileRepo = userProfileRepo;
        this.loginDto = loginDto;
        this.crqFeignInterface = crqFeignInterface;
        this.userRoleRepo = userRoleRepo;

    }

    public ResponseEntity<LoginResponseDto> userLogin(LoginModal loginModal) {

        return userProfileRepo.findById(loginModal.getUserName())
                .filter(user -> user.getPassword().equals(loginModal.getPassword()))
                .map(user -> {

                    List<String> roles = getUserRoles(user.getRoleIds());

                    LoginResponseDto response = new LoginResponseDto();
                    response.setUserName(user.getUserName());
                    response.setUserEmail(user.getUserEmail());
                    response.setDepartmentName(user.getDepartmentName());
                    response.setRoles(roles);

                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    private List<String> getUserRoles(String roleIds) {

        if (roleIds == null || roleIds.isBlank()) {
            return List.of();
        }

        List<Long> ids = Arrays.stream(roleIds.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(Long::parseLong)
                .toList();

        return userRoleRepo.findAllById(ids)
                .stream()
                .map(Role::getRoleName)
                .toList();
    }

    public UserProfile getUserByEmail(String email) {

        return userProfileRepo.findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found for email: " + email));
    }

    @Transactional
    public void saveUsersFromRota(List<RotaDetailsDto> rotaList, String crqNumber) {

        if (rotaList == null || rotaList.isEmpty()) return;

        // 🔥 GROUP BY USER EMAIL
        Map<String, List<RotaDetailsDto>> userMap =
                rotaList.stream()
                        .filter(r -> r.getPocEmail() != null && !r.getPocEmail().isBlank())
                        .collect(Collectors.groupingBy(RotaDetailsDto::getPocEmail));

        for (Map.Entry<String, List<RotaDetailsDto>> entry : userMap.entrySet()) {

            String email = entry.getKey();
            List<RotaDetailsDto> userRotaList = entry.getValue();

            // 🔥 GET OR CREATE USER
            UserProfile user = userProfileRepo.findById(email)
                    .orElseGet(UserProfile::new);

            boolean isNewUser = (user.getUserEmail() == null);

            if (isNewUser) {
                user.setUserEmail(email);
                user.setPassword("123"); // default password
            }

            // 🔥 TAKE FIRST ROW FOR COMMON FIELDS
            RotaDetailsDto first = userRotaList.get(0);

            user.setUserName(first.getPocName());
            user.setShiftDetails(first.getShiftDetails());
            user.setSupportTeamContact(first.getSupportTeamContact());
            user.setCrqNumber(crqNumber);
            user.setIsActive(true);

            // =========================================================
            // 🔥 DEPARTMENT HANDLING (REPLACE OLD VALUES)
            // =========================================================
            Set<String> departments = userRotaList.stream()
                    .map(RotaDetailsDto::getSupportTeam)
                    .filter(Objects::nonNull)
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toSet());

            user.setDepartmentName(String.join(",", departments));

            // =========================================================
            // 🔥 ROLE HANDLING (REPLACE OLD VALUES)
            // =========================================================
            Set<String> roleIds = new HashSet<>();

            for (String dept : departments) {

                Role role = userRoleRepo.findByRoleName(dept)
                        .orElseGet(() -> {
                            Role newRole = new Role();
                            newRole.setRoleName(dept);
                            newRole.setIsActive(true);
                            newRole.setCreatedBy("system");
                            newRole.setCreatedDate(LocalDateTime.now());
                            return userRoleRepo.save(newRole);
                        });

                roleIds.add(String.valueOf(role.getRoleId()));
            }

            user.setRoleIds(String.join(",", roleIds));

            // 🔥 SAVE USER
            userProfileRepo.save(user);
        }
    }

}
