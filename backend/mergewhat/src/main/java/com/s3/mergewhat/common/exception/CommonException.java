package com.s3.mergewhat.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
public class CommonException extends RuntimeException{
    private final ErrorCode errorCode;

    public CommonException(ErrorCode errorCode) {
        this.errorCode = errorCode;
    }

    // 에러 발생시 ErroCode별 메시지
    @Override
    public String getMessage() {
        return this.errorCode.getMessage();
    }

}
