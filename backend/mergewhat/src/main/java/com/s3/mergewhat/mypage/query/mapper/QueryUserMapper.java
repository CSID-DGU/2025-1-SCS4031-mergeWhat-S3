package com.s3.mergewhat.mypage.query.mapper;

import com.s3.mergewhat.member.command.domain.vo.response.ResponseUserProfileVO;
import com.s3.mergewhat.post.command.domain.vo.ResponsePostAndImageVO;
import com.s3.mergewhat.storereview.command.domain.vo.ResponseStoreReviewVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.security.core.parameters.P;

import java.util.List;

@Mapper
public interface QueryUserMapper {
    ResponseUserProfileVO findUserProfile(@Param("userId") Long userId);

    List<ResponsePostAndImageVO> findMyPosts(@Param("userId") Long userId);

    List<ResponseStoreReviewVO> findMyReviews(@Param("userId") Long userId);
}
