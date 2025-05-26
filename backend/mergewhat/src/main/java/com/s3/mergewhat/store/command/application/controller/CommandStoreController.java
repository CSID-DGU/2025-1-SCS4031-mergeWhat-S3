package com.s3.mergewhat.store.command.application.controller;

import com.s3.mergewhat.common.ResponseDTO;
import com.s3.mergewhat.store.command.application.dto.StoreDetailDTO;
import com.s3.mergewhat.store.command.application.service.CommandStoreService;
import com.s3.mergewhat.store.command.domain.vo.RequestStoreVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/stores")
public class CommandStoreController {

    private final CommandStoreService commandStoreService;

    @PostMapping
    public ResponseDTO<?> createStore(@RequestBody RequestStoreVO request) {
        return ResponseDTO.ok(commandStoreService.create(request));
    }

    @PutMapping("/update/{id}")
    public ResponseDTO<?> updateStore(@PathVariable Long id, @RequestBody RequestStoreVO request) {
        return ResponseDTO.ok(commandStoreService.update(id, request));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseDTO<?> deleteStore(@PathVariable Long id) {
        return ResponseDTO.ok(commandStoreService.delete(id));
    }

}
