import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import {fetchReviewsByStoreId} from '../../api/post';
import {StoreReview} from '../../types/common';
import {useFocusEffect} from '@react-navigation/native';

const ReviewList = ({
  storeId,
  showAverage = false,
  onAverageRatingChange,
}: {
  storeId: number;
  showAverage?: boolean;
  onAverageRatingChange?: (avg: number) => void;
}) => {
  const [reviewList, setReviewList] = useState<StoreReview[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);

  const isValidDate = (date: any) => {
    return !isNaN(Date.parse(date));
  };

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        try {
          const data = await fetchReviewsByStoreId(storeId);
          setReviewList(data as unknown as StoreReview[]);

          if (data.length > 0) {
            const total = data.reduce(
              (sum, r) => sum + (r as unknown as StoreReview).review_rating,
              0,
            );
            const avg = total / data.length;
            setAverageRating(Math.round(avg));
            if (onAverageRatingChange) onAverageRatingChange(Math.round(avg));
          }
        } catch (err) {
          console.error('❌ 리뷰 불러오기 실패:', err);
        }
      };

      load();
    }, [storeId]),
  );

  const [likedReviews, setLikedReviews] = useState<{
    [reviewId: number]: boolean;
  }>({});
  const [likeCounts, setLikeCounts] = useState<{[reviewId: number]: number}>(
    {},
  );
  const [commentVisible, setCommentVisible] = useState<{
    [reviewId: number]: boolean;
  }>({});
  const [commentInputs, setCommentInputs] = useState<{
    [reviewId: number]: string;
  }>({});

  const toggleLike = (id: number) => {
    setLikedReviews(prev => ({...prev, [id]: !prev[id]}));
    setLikeCounts(prev => ({
      ...prev,
      [id]: (prev[id] ?? 0) + (likedReviews[id] ? -1 : 1),
    }));
  };

  const toggleCommentInput = (id: number) => {
    setCommentVisible(prev => ({...prev, [id]: !prev[id]}));
  };

  const handleCommentSubmit = (id: number) => {
    const text = commentInputs[id]?.trim();
    if (text) {
      Alert.alert('댓글 등록됨', text);
      setCommentInputs(prev => ({...prev, [id]: ''}));
      setCommentVisible(prev => ({...prev, [id]: false}));
    }
  };

  return (
    <View style={{paddingHorizontal: 10, marginTop: 24}}>
      {showAverage && averageRating !== null && (
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              marginRight: 10,
              marginTop: 40,
              marginLeft: 1,
              marginBottom: 20,
            }}>
            {averageRating.toFixed(1)}
          </Text>
          {Array.from({length: 5}, (_, i) => (
            <Text
              key={i}
              style={{
                fontSize: 20,
                color: i < averageRating ? '#FF5A5F' : '#ccc',
                marginTop: 37,
                marginBottom: 20,
              }}>
              ★
            </Text>
          ))}
        </View>
      )}

      {reviewList.length > 0 ? (
        reviewList.map((review, idx) => {
          let createdDate = '날짜오류';

          try {
            const date = new Date(review.review_created_at);
            if (!isNaN(date.getTime())) {
              createdDate = date.toISOString().slice(0, 10).replace(/-/g, '.');
            }
          } catch (e) {
            console.error('❌ 날짜 파싱 오류:', e);
          }

          const stars =
            '★'.repeat(review.review_rating) +
            '☆'.repeat(5 - review.review_rating);

          return (
            <View key={idx} style={styles.reviewCard}>
              <View style={styles.row}>
                <Text style={styles.nickname}>{review.user_nickname}</Text>
                <Text style={styles.stars}>{stars}</Text>
              </View>
              <Text style={styles.date}>{createdDate}</Text>
              <Text style={styles.comment}>{review.review_comment}</Text>

              {/* 좋아요 & 댓글 아이콘 영역 */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 8,
                }}>
                <TouchableOpacity
                  onPress={() => toggleLike(review.review_id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginRight: 16,
                  }}>
                  <Text style={{fontSize: 16}}>
                    {likedReviews[review.review_id] ? '❤️' : '🤍'}
                  </Text>
                  <Text style={{marginLeft: 4}}>
                    {likeCounts[review.review_id] ?? 0}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => toggleCommentInput(review.review_id)}
                  style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('../../assets/community_icon.png')}
                    style={{width: 18, height: 18}}
                  />
                  <Text style={{marginLeft: 4}}>댓글</Text>
                </TouchableOpacity>
              </View>

              {/* 댓글 입력창 (조건부 렌더링) */}
              {commentVisible[review.review_id] && (
                <View
                  style={{
                    marginTop: 8,
                    padding: 10,
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 8,
                    backgroundColor: '#fdfdfd',
                  }}>
                  {/* 상단 X 버튼 */}
                  <View
                    style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <TouchableOpacity
                      onPress={() =>
                        setCommentVisible(prev => ({
                          ...prev,
                          [review.review_id]: false,
                        }))
                      }>
                      <Text style={{fontSize: 16, color: '#999'}}>✕</Text>
                    </TouchableOpacity>
                  </View>

                  {/* 댓글 입력창 */}
                  <TextInput
                    value={commentInputs[review.review_id]}
                    onChangeText={text =>
                      setCommentInputs(prev => ({
                        ...prev,
                        [review.review_id]: text,
                      }))
                    }
                    placeholder="댓글을 입력하세요..."
                    style={{
                      height: 40,
                      borderBottomWidth: 1,
                      borderBottomColor: '#ccc',
                      marginTop: 2,
                      paddingHorizontal: 4,
                    }}
                  />

                  {/* 등록 버튼 */}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      marginTop: 10,
                    }}>
                    <TouchableOpacity
                      onPress={() => handleCommentSubmit(review.review_id)}>
                      <Text style={{color: '#3366FF', fontWeight: '600'}}>
                        등록
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          );
        })
      ) : (
        <Text style={{textAlign: 'center', color: '#aaa', marginTop: 20}}>
          작성된 리뷰가 없습니다.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  reviewCard: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
    paddingVertical: 14,
    alignSelf: 'stretch',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nickname: {
    fontWeight: 'bold',
    fontSize: 15,
    marginRight: 8,
  },
  stars: {
    color: '#f1c40f',
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  comment: {
    fontSize: 14,
    color: '#444',
  },
});

export default ReviewList;
