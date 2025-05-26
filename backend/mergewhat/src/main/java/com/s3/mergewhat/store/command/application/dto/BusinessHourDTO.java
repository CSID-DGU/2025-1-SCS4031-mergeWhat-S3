package com.s3.mergewhat.store.command.application.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusinessHourDTO {
    private Long id;

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private Long storeId;

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private DayKor day;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime openTime;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime closeTime;

    private boolean isClosed;

}
