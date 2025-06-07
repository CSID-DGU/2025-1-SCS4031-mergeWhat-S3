package com.s3.mergewhat.storereview.service;

import com.s3.mergewhat.common.S3Uploader;
import com.s3.mergewhat.common.exception.CommonException;
import com.s3.mergewhat.common.exception.ErrorCode;
import com.s3.mergewhat.member.command.domain.aggregate.entity.Member;
import com.s3.mergewhat.member.command.domain.aggregate.entity.repository.MemberRepository;
import com.s3.mergewhat.store.domain.aggregate.entity.Store;
import com.s3.mergewhat.store.domain.repository.StoreRepository;
import com.s3.mergewhat.storereview.domain.aggregate.entity.ReviewImage;
import com.s3.mergewhat.storereview.domain.aggregate.entity.StoreReview;
import com.s3.mergewhat.storereview.domain.repository.StoreReviewImageRepository;
import com.s3.mergewhat.storereview.domain.repository.StoreReviewRepository;
import com.s3.mergewhat.storereview.vo.RequestStoreReviewVO;
import com.s3.mergewhat.storereview.vo.ResponseStoreReviewVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StoreReviewServiceImpl implements StoreReviewService {

    private final StoreReviewRepository storeReviewRepository;
    private final MemberRepository memberRepository;
    private final StoreRepository storeRepository;
    private final S3Uploader s3Uploader;
    private final StoreReviewImageRepository storeReviewImageRepository;


    @Override
    public List<ResponseStoreReviewVO> getReviewByStoreId(Long storeId) {
        List<StoreReview> reviews = storeReviewRepository.findByStoreIdOrderByCreatedAtDesc(storeId);

        return reviews.stream()
                .map(review -> new ResponseStoreReviewVO(
                        review.getId(),
                        review.getMember().getId(),
                        review.getStore().getId(),
                        review.getRating(),
                        review.getComment(),
                        review.getCreatedAt(),
                        review.getReviewImages().stream()
                                .map(ReviewImage::getImageUrl)
                                .toList()
                ))
                .toList();
    }

    @Override
    @Transactional
    public ResponseStoreReviewVO create(RequestStoreReviewVO request,
                                        List<MultipartFile> images) {

        Member member = memberRepository.findById(request.getUserId())
                .orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_MEMBER));
        Store store = storeRepository.findById(request.getStoreId())
                .orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_STORE));

        StoreReview review = StoreReview.builder()
                .member(member)
                .store(store)
                .rating(request.getRating())
                .comment(request.getComment())
                .createdAt(LocalDateTime.now())
                .build();

        storeReviewRepository.save(review);

        List<String> imageUrls = new ArrayList<>();
        for (MultipartFile image : images) {
            String imageUrl = s3Uploader.upload(image, "review");
            imageUrls.add(imageUrl);
            storeReviewImageRepository.save(
                    ReviewImage.builder()
                            .review(review)
                            .imageUrl(imageUrl)
                            .build()
            );
        }
        return toVO(review, imageUrls);
    }

    @Override
    @Transactional
    public ResponseStoreReviewVO update(Long id, RequestStoreReviewVO request) {
        StoreReview review = storeReviewRepository.findById(id)
                .orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_REVIEW));

        review.update(request.getRating(), request.getComment());
        List<String> imageUrls = storeReviewImageRepository.findAllByReviewId(review.getId())
                .stream()
                .map(ReviewImage::getImageUrl)
                .collect(Collectors.toList());
        return toVO(review, imageUrls);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        StoreReview review = storeReviewRepository.findById(id)
                .orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_REVIEW));
        storeReviewRepository.delete(review);
    }

    private ResponseStoreReviewVO toVO(StoreReview save, List<String> imageUrls) {
        return new ResponseStoreReviewVO(
                save.getId(),
                save.getMember().getId(),
                save.getStore().getId(),
                save.getRating(),
                save.getComment(),
                save.getCreatedAt(),
                imageUrls
        );
    }
}
