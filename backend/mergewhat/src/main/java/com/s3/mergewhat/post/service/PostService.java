package com.s3.mergewhat.post.service;

import com.s3.mergewhat.post.domain.aggregate.BoardType;
import com.s3.mergewhat.post.domain.vo.RequestPostVO;
import com.s3.mergewhat.post.domain.vo.ResponsePostAndImageVO;
import com.s3.mergewhat.post.domain.vo.ResponsePostVO;

import java.util.List;

public interface PostService {

    ResponsePostVO create(RequestPostVO request);
    ResponsePostVO update(Long id, RequestPostVO request);
    ResponsePostVO delete(Long id);

    List<ResponsePostAndImageVO> getPostsByCategory(BoardType boardType);
}
