package com.s3.mergewhat.store.command.application.controller;

import com.s3.mergewhat.common.ResponseDTO;
import com.s3.mergewhat.store.command.application.dto.StoreDetailDTO;
import com.s3.mergewhat.store.command.application.service.CommandStoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/stores")
public class CommandStoreController {

    private final CommandStoreService commandStoreService;

    @PostMapping
    public ResponseDTO<?> createStore(@RequestBody StoreDetailDTO dto) {
        return ResponseDTO.ok(commandStoreService.create(dto));
    }

//    @PutMapping("/{id}")
//    public ResponseDTO<?> updateStore(@PathVariable Long id, @RequestBody StoreDetailDTO dto) {
//        return ResponseDTO.ok(commandStoreService.update(id, dto));
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseDTO<?> deleteStore(@PathVariable Long id) {
//        commandStoreService.delete(id);
//        return ResponseDTO.ok(null);
//    }

}
