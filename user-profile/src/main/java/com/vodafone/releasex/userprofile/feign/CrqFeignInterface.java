package com.vodafone.releasex.userprofile.feign;

import com.vodafone.releasex.userprofile.dto.RotaDetailsDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;

@FeignClient("SERVICE-CRQ")
public interface CrqFeignInterface {

    @GetMapping("/api/v2/file/rota-details")
    List<RotaDetailsDto> getRotaDetails();

}
