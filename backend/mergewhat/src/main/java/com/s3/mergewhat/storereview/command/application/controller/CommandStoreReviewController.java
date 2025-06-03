package com.s3.mergewhat.storereview.command.application.controller;

import com.s3.mergewhat.common.ResponseDTO;
import com.s3.mergewhat.storereview.command.application.service.CommandStoreReviewService;
import com.s3.mergewhat.storereview.command.domain.vo.RequestStoreReviewVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class CommandStoreReviewController {

    private final CommandStoreReviewService commandStoreReviewService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseDTO<?> createReview(@RequestPart RequestStoreReviewVO request,
                                       @RequestPart List<MultipartFile> images) {
        return ResponseDTO.ok(commandStoreReviewService.create(request, images));
    }

    @PutMapping("/{id}")
    public ResponseDTO<?> updateReview(@RequestBody RequestStoreReviewVO request, @PathVariable Long id) {
        return ResponseDTO.ok(commandStoreReviewService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseDTO<?> deleteReview(@PathVariable Long id) {
        commandStoreReviewService.delete(id);
        return ResponseDTO.ok(null);
    }


}
