package com.s3.mergewhat.member.command.application.controller;

import com.s3.mergewhat.common.ResponseDTO;
import com.s3.mergewhat.member.command.application.mapper.MemberConverter;
import com.s3.mergewhat.member.command.application.service.CommandMemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/member")
public class CommandMemberController {

    private final CommandMemberService commandMemberService;
    private final MemberConverter memberConverter;

    @Autowired
    public CommandMemberController(CommandMemberService commandMemberService, MemberConverter memberConverter) {
        this.commandMemberService = commandMemberService;
        this.memberConverter = memberConverter;
    }

    // 회원가입
    @PostMapping("signup")
    public ResponseDTO<?> createSignup(@RequestBody RequestSignupMemberVO requestSignupMemberVO) {

        MemberDTO requestMemberDTO = memberConverter.fromSignupVOToDTO(requestSignupMemberVO);
        MemberDTO responseMemberDTO = commandMemberService.signup(requestMemberDTO);
        ResponseSignupMemberVO response = memberConverter.fromDTOToSignupVO(responseMemberDTO);

        return ResponseDTO.ok(response);
    }

}
