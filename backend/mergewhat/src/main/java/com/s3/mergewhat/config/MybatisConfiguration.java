package com.s3.mergewhat.config;

import org.apache.ibatis.annotations.Mapper;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan(basePackages = {
        "com.s3.mergewhat.post.query.mapper",
        "com.s3.mergewhat.store.query.mapper",
        "com.s3.mergewhat.market.query.mapper",
        "com.s3.mergewhat.mypage.query.mapper",
        "com.s3.mergewhat.storereview.query.mapper"
}, annotationClass = Mapper.class)
public class MybatisConfiguration {
}
