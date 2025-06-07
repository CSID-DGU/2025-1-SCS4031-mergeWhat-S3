package com.s3.mergewhat.market.controller;

import com.s3.mergewhat.market.domain.aggregate.entity.Entertainment;
import com.s3.mergewhat.market.service.ImageCrawlService;
import com.s3.mergewhat.market.vo.ResponseEntertainmentVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/entertainment-image")
public class EntertainmentController {
    private final ImageCrawlService service;

    @GetMapping("{marketId}/{placeName}/{isIndoor}")
    public ResponseEntity<ResponseEntertainmentVO> getImage(
            @PathVariable Long marketId,
            @PathVariable String placeName,
            @PathVariable Boolean isIndoor
    ) {
        System.out.println("🎯 [요청 확인] marketId=" + marketId + ", placeName=" + placeName + ", isIndoor=" + isIndoor);

        String imageUrl = service.getOrCrawlImage(marketId, placeName, isIndoor);

        if (imageUrl == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        return ResponseEntity.ok(new ResponseEntertainmentVO(placeName, imageUrl));
    }
}
