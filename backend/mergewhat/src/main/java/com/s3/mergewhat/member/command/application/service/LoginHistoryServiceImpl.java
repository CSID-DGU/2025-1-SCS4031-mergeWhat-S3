package com.s3.mergewhat.member.command.application.service;

import com.s3.mergewhat.member.command.domain.aggregate.entity.repository.MemberLoginHistoryRepository;
import com.s3.mergewhat.member.command.domain.aggregate.entity.repository.MerchantLoginHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoginHistoryServiceImpl implements LoginHistoryService {

    private final MemberLoginHistoryRepository memberloginHistoryRepository;
    private final MerchantLoginHistoryRepository merchantLoginHistoryRepository;

    @Autowired
    public LoginHistoryServiceImpl(MemberLoginHistoryRepository loginHistoryRepository,
                                   MerchantLoginHistoryRepository merchantLoginHistoryRepository) {
        this.memberloginHistoryRepository = loginHistoryRepository;
        this.merchantLoginHistoryRepository = merchantLoginHistoryRepository;
    }

}
