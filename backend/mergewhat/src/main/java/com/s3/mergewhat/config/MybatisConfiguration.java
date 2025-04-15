package com.s3.mergewhat.config;

import org.apache.ibatis.annotations.Mapper;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan(basePackages = "com.s3.*.query.repository", annotationClass = Mapper.class)
public class MybatisConfiguration {
}
