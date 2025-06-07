package com.s3.mergewhat.member.command.application.mapper;

import com.s3.mergewhat.member.command.application.dto.MemberDTO;
import com.s3.mergewhat.member.command.domain.aggregate.entity.Member;
import com.s3.mergewhat.member.command.domain.aggregate.entity.Role;
import com.s3.mergewhat.member.command.domain.vo.request.RequestSignupMemberVO;
import com.s3.mergewhat.member.command.domain.vo.response.ResponseSignupMemberVO;
import org.springframework.stereotype.Component;

import static java.lang.String.valueOf;

@Component
public class MemberConverter {

    public MemberDTO fromSignupVOToDTO(RequestSignupMemberVO requestSignupMemberVO, String role) {
        return MemberDTO.builder()
                .email(requestSignupMemberVO.getEmail())
                .password(requestSignupMemberVO.getPassword())
                .nickname(requestSignupMemberVO.getNickname())
                .profileUrl(requestSignupMemberVO.getProfileUrl())
                .bizRegistrationNumber(requestSignupMemberVO.getBizRegistrationNumber())
                .bizRegistrationUrl(requestSignupMemberVO.getBizRegistrationUrl())
                .role(role)
                .build();
    }

    public ResponseSignupMemberVO fromDTOToSignupVO(MemberDTO memberDTO) {
        return ResponseSignupMemberVO.builder()
                .email(memberDTO.getEmail())
                .password(memberDTO.getPassword())
                .nickname(memberDTO.getNickname())
                .profileUrl(memberDTO.getProfileUrl())
                .bizRegistrationNumber(memberDTO.getBizRegistrationNumber())
                .bizRegistrationUrl(memberDTO.getBizRegistrationUrl())
                .role(Role.valueOf(memberDTO.getRole()))
                .build();
    }

    public Member fromDTOToEntity(MemberDTO memberDTO) {
        return Member.builder()
                .email(memberDTO.getEmail())
                .password(memberDTO.getPassword())
                .nickname(memberDTO.getNickname())
                .profileUrl(memberDTO.getProfileUrl())
                .bizRegistrationNumber(memberDTO.getBizRegistrationNumber())
                .bizRegistrationUrl(memberDTO.getBizRegistrationUrl())
                .role(Role.valueOf(memberDTO.getRole()))
                .socialId(memberDTO.getSocialId())
                .socialType(memberDTO.getSocialType())
                .isSocial(memberDTO.isSocial())
                .cratedAt(memberDTO.getCreatedAt())
                .build();
    }

    public MemberDTO fromEntityToDTO(Member member) {
        return MemberDTO.builder()
                .email(member.getEmail())
                .password(member.getPassword())
                .nickname(member.getNickname())
                .profileUrl(member.getProfileUrl())
                .bizRegistrationNumber(member.getBizRegistrationNumber())
                .bizRegistrationUrl(member.getBizRegistrationUrl())
                .role(member.getRole().name())
                .socialId(member.getSocialId())
                .socialType(member.getSocialType())
                .isSocial(member.isSocial())
                .createdAt(member.getCratedAt())
                .build();
    }

}
