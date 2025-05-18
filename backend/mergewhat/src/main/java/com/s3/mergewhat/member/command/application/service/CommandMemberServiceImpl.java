package com.s3.mergewhat.member.command.application.service;

import com.s3.mergewhat.config.security.JWTUtil;
import com.s3.mergewhat.member.command.application.dto.SocialUserInfo;
import com.s3.mergewhat.member.command.application.oauth.service.OAuth2ServiceFactory;
import com.s3.mergewhat.member.command.application.oauth.service.OAuth2ProviderService;
import com.s3.mergewhat.member.command.application.dto.MemberDTO;
import com.s3.mergewhat.member.command.application.mapper.MemberConverter;
import com.s3.mergewhat.member.command.domain.aggregate.entity.Member;
import com.s3.mergewhat.member.command.domain.aggregate.entity.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CommandMemberServiceImpl implements CommandMemberService{

    private final MemberRepository memberRepository;
    private final MemberConverter memberConverter;
    private final JWTUtil jwtUtil;
    private final OAuth2ServiceFactory oAuth2ServiceFactory;

//    private final BCryptPasswordEncoder bCryptPasswordEncoder;
//    private final QueryMemberService queryMemberService;

    // 소셜 로그인
    @Transactional
    @Override
    public String processSocialLogin(String provider, String accessToken) {
        OAuth2ProviderService providerService = oAuth2ServiceFactory.getService(provider);
        SocialUserInfo userInfo = providerService.getUserInfo(accessToken);

        Member member = memberRepository.findBySocialIdAndSocialType(userInfo.getSocialId(), provider.toUpperCase());

        if (member == null) {
            MemberDTO dto = MemberDTO.builder()
                    .email(userInfo.getEmail())
                    .nickname(userInfo.getName())
                    .password("-")
                    .profileUrl(userInfo.getProfileImage())
                    .role("USER")
                    .bizRegistrationNumber(null)
                    .bizRegistrationUrl(null)
                    .createdAt(LocalDateTime.now())
                    .socialId(userInfo.getSocialId())
                    .socialType(provider.toUpperCase())
                    .isSocial(true)
                    .build();
            member = memberRepository.save(memberConverter.fromDTOToEntity(dto));
        }

        return jwtUtil.generateToken(member.getId());
    }

//    // 일반회원가입
//    @Override
//    @Transactional
//    public MemberDTO signupUser(MemberDTO requestMemberDTO) {
//        if (queryMemberService.emailCheck(requestMemberDTO.getEmail())) {
//            throw new CommonException(ErrorCode.EXIST_USER);
//        }
//        requestMemberDTO.encodedPwd(bCryptPasswordEncoder.encode(requestMemberDTO.getPassword()));
//        Member member = memberConverter.fromDTOToEntity(requestMemberDTO);
//        memberRepository.save(member);
//
//        return memberConverter.fromEntityToDTO(member);
//    }

//    // 상인회원가입
//    // 사업자 등록증을 PDF 파일로 받음
//    @Override
//    public MemberDTO signupMerchant(MemberDTO requestMemberDTO, MultipartFile regFile) throws IOException {
//
//        // 파일 저장 (추후 s3 연동)
//        String filePath = saveFile(regFile);
//
//        if (queryMemberService.emailCheck(requestMemberDTO.getEmail())) {
//            throw new CommonException(ErrorCode.EXIST_USER);
//        }
//
//        // 요청한 파일 OCR 파싱
//
//
//        Member member = memberConverter.fromDTOToEntity(requestMemberDTO);
//
//        return memberConverter.fromEntityToDTO(member);
//    }
//
//    public String saveFile(MultipartFile file) throws IOException {
//        String path = "";
//        return path;
//    }

}
