package com.s3.mergewhat.member.command.application.service;

import com.s3.mergewhat.member.command.application.dto.MemberDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface CommandMemberService {


    String processSocialLogin(String provider, String accessToken);

//    MemberDTO signupUser(MemberDTO requestMemberDTO);
//
//    MemberDTO signupMerchant(MemberDTO requestMemberDTO, MultipartFile regFile) throws IOException;

}
