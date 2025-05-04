package com.s3.mergewhat.common.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    // 400: 잘못된 요청 (Bad Request)
    WRONG_ENTRY_POINT(40000, HttpStatus.BAD_REQUEST, "잘못된 접근입니다"), // 사용자가 잘못된 URL로 접근했을 때 발생
    MISSING_REQUEST_PARAMETER(40001, HttpStatus.BAD_REQUEST, "필수 요청 파라미터가 누락되었습니다."), // 요청에 필요한 파라미터가 누락된 경우
    INVALID_PARAMETER_FORMAT(40002, HttpStatus.BAD_REQUEST, "요청에 유효하지 않은 인자 형식입니다."), // 파라미터 형식이 잘못된 경우
    BAD_REQUEST_JSON(40003, HttpStatus.BAD_REQUEST, "잘못된 JSON 형식입니다."), // JSON 요청 형식 오류
    DATA_INTEGRITY_VIOLATION(40004, HttpStatus.BAD_REQUEST, "데이터 무결성 위반입니다. 필수 값이 누락되었거나 유효하지 않습니다."), // 데이터베이스 무결성 위반 (예: NOT NULL 컬럼에 NULL 삽입 시도)
    INVALID_INPUT_VALUE(40005, HttpStatus.BAD_REQUEST, "잘못된 입력 값입니다."), // 입력 값이 유효하지 않은 경우
    INVALID_REQUEST_BODY(40006, HttpStatus.BAD_REQUEST, "잘못된 요청 본문입니다."), // 요청 본문에 유효하지 않은 데이터가 포함된 경우
    MISSING_REQUIRED_FIELD(40007, HttpStatus.BAD_REQUEST, "필수 필드가 누락되었습니다."), // JSON 또는 요청 데이터에서 필수 필드가 누락된 경우

    // 401: 인증 실패 (Unauthorized)
    INVALID_HEADER_VALUE(40100, HttpStatus.UNAUTHORIZED, "올바르지 않은 헤더값입니다."), // 헤더 값이 잘못되었거나 누락된 경우
    EXPIRED_TOKEN_ERROR(40101, HttpStatus.UNAUTHORIZED, "만료된 토큰입니다."), // 인증 토큰이 만료된 경우
    INVALID_TOKEN_ERROR(40102, HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다."), // 토큰이 잘못되었거나 위조된 경우
    TOKEN_MALFORMED_ERROR(40103, HttpStatus.UNAUTHORIZED, "토큰이 올바르지 않습니다."), // 토큰 구조가 올바르지 않은 경우
    TOKEN_TYPE_ERROR(40104, HttpStatus.UNAUTHORIZED, "토큰 타입이 일치하지 않거나 비어있습니다."), // 토큰의 타입이 잘못되었거나 누락된 경우
    TOKEN_UNSUPPORTED_ERROR(40105, HttpStatus.UNAUTHORIZED, "지원하지 않는 토큰입니다."), // 서버가 지원하지 않는 토큰 유형
    TOKEN_GENERATION_ERROR(40106, HttpStatus.UNAUTHORIZED, "토큰 생성에 실패하였습니다."), // 토큰 생성 중 오류 발생
    TOKEN_UNKNOWN_ERROR(40107, HttpStatus.UNAUTHORIZED, "알 수 없는 토큰입니다."), // 알 수 없는 이유로 토큰이 유효하지 않은 경우
    LOGIN_FAILURE(40108, HttpStatus.UNAUTHORIZED, "로그인에 실패했습니다"), // 로그인 실패
    UNAUTHORIZED_ACCESS(40109, HttpStatus.UNAUTHORIZED, "인증되지 않은 접근입니다."), // 인증되지 않은 사용자 접근
    EXPIRED_SESSION(40110, HttpStatus.UNAUTHORIZED, "세션이 만료되었습니다."), // 사용자 세션이 만료된 경우
    EXIST_USER(40111, HttpStatus.UNAUTHORIZED, "이미 회원가입한 회원입니다."), // 이미 회원가입된 사용자
    NOT_FOUND_USER_ID(40112, HttpStatus.UNAUTHORIZED, "아이디를 잘못 입력하셨습니다."), // 잘못된 아이디 입력
    INVALID_PASSWORD(40113, HttpStatus.UNAUTHORIZED, "비밀번호를 잘못 입력하셨습니다."), // 비밀번호가 잘못된 경우

    // 403: 권한 부족 (Forbidden)
    FORBIDDEN_ROLE(40300, HttpStatus.FORBIDDEN, "요청한 리소스에 대한 권한이 없습니다."), // 사용자가 요청한 리소스에 대한 권한이 없는 경우
    ACCESS_DENIED(40301, HttpStatus.FORBIDDEN, "접근 권한이 거부되었습니다."), // 권한 부족으로 접근이 거부된 경우

    // 404: 리소스를 찾을 수 없음 (Not Found)
    NOT_FOUND_MEMBER(40401, HttpStatus.NOT_FOUND, "회원이 존재하지 않습니다."),
    NOT_FOUND_MARKET(40402, HttpStatus.NOT_FOUND, "시장이 존재하지 않습니다."),
    // 429: 요청 과다 (Too Many Requests)
    TOO_MANY_REQUESTS(42900, HttpStatus.TOO_MANY_REQUESTS, "요청 횟수가 너무 많습니다. 잠시 후 다시 시도해 주세요."),

    // 500: 서버 내부 오류 (Internal Server Error)
    INTERNAL_SERVER_ERROR(50000, HttpStatus.INTERNAL_SERVER_ERROR, "서버 내부 오류입니다");

    private final Integer code;
    private final HttpStatus httpStatus;
    private final String message;

}
