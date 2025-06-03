package com.s3.mergewhat.post.query.mapper;

import com.s3.mergewhat.post.command.domain.vo.ResponsePostAndImageVO;
import com.s3.mergewhat.post.command.domain.vo.ResponsePostVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface QueryPostMapper {
    List<ResponsePostAndImageVO> findPostsByBoardType(@Param("boardType") String boardType);

    ResponsePostAndImageVO findPostById(@Param("postId") Long postId);
}
