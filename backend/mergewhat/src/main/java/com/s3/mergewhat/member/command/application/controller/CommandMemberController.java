package com.s3.mergewhat.member.command.application.controller;

import com.s3.mergewhat.common.ResponseDTO;
import com.s3.mergewhat.member.command.application.dto.MemberDTO;
import com.s3.mergewhat.member.command.application.mapper.MemberConverter;
import com.s3.mergewhat.member.command.application.service.CommandMemberService;
import com.s3.mergewhat.member.command.domain.vo.request.RequestSignupMemberVO;
import com.s3.mergewhat.member.command.domain.vo.request.RequestSocialLoginMemberVO;
import com.s3.mergewhat.member.command.domain.vo.response.ResponseSignupMemberVO;
import com.s3.mergewhat.member.command.domain.vo.response.ResponseSocialLoginMemberVO;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.formula.functions.T;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class CommandMemberController {

    private final CommandMemberService commandMemberService;
    private final MemberConverter memberConverter;

    // 소셜 로그인
    @PostMapping("/kakao")
    public ResponseDTO<?> socialLogin(@RequestBody RequestSocialLoginMemberVO request) {
        String jwt = commandMemberService.processSocialLogin(request.getProvider(), request.getAccessToken());
        return ResponseDTO.ok(new ResponseSocialLoginMemberVO(jwt));
    }


    // 추후 고도화 시 서비스 자체 회원도 개발할 예정
//    // 일반 회원가입
//    @PostMapping("signup/user")
//    public ResponseDTO<?> signupUser(@RequestBody RequestSignupMemberVO requestSignupMemberVO) {
//
//        MemberDTO requestMemberDTO = memberConverter.fromSignupVOToDTO(requestSignupMemberVO, "USER");
//
//        MemberDTO responseMemberDTO = commandMemberService.signupUser(requestMemberDTO);
//        ResponseSignupMemberVO response = memberConverter.fromDTOToSignupVO(responseMemberDTO);
//
//        return ResponseDTO.ok(response);
//    }

//    // 상인 회원가입
//    @PostMapping("signup/merchant")
//    public ResponseDTO<?> signupMerchant(@RequestPart RequestSignupMemberVO requestSignupMemberVO,
//                                         @RequestPart MultipartFile regFile) {
//
//        MemberDTO requestMemberDTO = memberConverter.fromSignupVOToDTO(requestSignupMemberVO, "MERCHANT");
//        MemberDTO responseMemberDTO = commandMemberService.signupMerchant(requestMemberDTO, regFile);
//
//        ResponseSignupMemberVO response = memberConverter.fromDTOToSignupVO(responseMemberDTO);
//
//        return ResponseDTO.ok(response);
//    }


}
