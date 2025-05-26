package com.s3.mergewhat.post.command.application.service;

import com.s3.mergewhat.post.command.domain.vo.RequestPostVO;
import com.s3.mergewhat.post.command.domain.vo.ResponsePostVO;

public interface CommandPostService {

    ResponsePostVO create(RequestPostVO request);
    ResponsePostVO update(Long id, RequestPostVO request);
    ResponsePostVO delete(Long id);

}
