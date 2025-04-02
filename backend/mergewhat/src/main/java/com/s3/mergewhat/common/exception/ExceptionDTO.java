package com.s3.mergewhat.common.exception;

import lombok.Getter;

// 에러 응답 형식
@Getter
public class ExceptionDTO {

    private final Integer code;
    private final String message;
    public ExceptionDTO(ErrorCode errorCode) {
        this.code = errorCode.getCode();
        this.message = errorCode.getMessage();
    }

    public static ExceptionDTO of(ErrorCode errorCode){
        return new ExceptionDTO(errorCode);
    }

}
