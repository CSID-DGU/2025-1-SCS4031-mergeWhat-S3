import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import {fetchReviewsByStoreId} from '../../api/review';
import {StoreReview} from '../../types/common';
import {reviewImageMap} from '../../components/IndoorInfo/ReviewMapping';

interface ReviewListProps {
  storeId: number;
  showAverage?: boolean;
  onAverageRatingChange?: (avg: number) => void;
  sortBy: 'latest' | 'highestRating' | 'lowestRating';
  onReviewsLoaded?: (reviews: StoreReview[]) => void;
}

const ReviewList: React.FC<ReviewListProps> = ({
  storeId,
  showAverage = false,
  onAverageRatingChange,
  sortBy,
  onReviewsLoaded,
}) => {
  const [reviews, setReviews] = useState<StoreReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  const loadReviews = useCallback(async () => {
    setLoading(true);

    try {
      const fetchedReviews = await fetchReviewsByStoreId(storeId);
      console.log('[ReviewList] fetchedReviews raw:', fetchedReviews);

      if (!Array.isArray(fetchedReviews)) {
        console.warn('API 응답이 배열이 아닙니다:', fetchedReviews);
        setReviews([]);
        if (onReviewsLoaded) onReviewsLoaded([]);
        return;
      }

      let sortedReviews = [...fetchedReviews];

      if (sortBy === 'latest') {
        sortedReviews.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
      } else if (sortBy === 'highestRating') {
        sortedReviews.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === 'lowestRating') {
        sortedReviews.sort((a, b) => a.rating - b.rating);
      }

      const enrichedReviews = sortedReviews.map(r => ({
        ...r,
        image: r.image || reviewImageMap[r.id] || null, // DB에 이미지 없을 때만 매핑
      }));

      setReviews(enrichedReviews);

      //setReviews(sortedReviews);

      if (enrichedReviews.length > 0) {
        const validRatings = enrichedReviews
          .map(r => Number(r.rating))
          .filter(r => !isNaN(r));

        const totalRating = validRatings.reduce((sum, r) => sum + r, 0);
        const avg =
          validRatings.length > 0 ? totalRating / validRatings.length : 0;

        setAverageRating(parseFloat(avg.toFixed(1)));

        if (onAverageRatingChange) {
          onAverageRatingChange(parseFloat(avg.toFixed(1)));
        }
      } else {
        setAverageRating(0);
        if (onAverageRatingChange) {
          onAverageRatingChange(0);
        }
      }

      if (onReviewsLoaded) {
        onReviewsLoaded(enrichedReviews);
      }
    } catch (error) {
      console.error('리뷰 불러오기 실패:', error);
      setReviews([]);
      setAverageRating(0);
      if (onAverageRatingChange) {
        onAverageRatingChange(0);
      }
      if (onReviewsLoaded) {
        onReviewsLoaded([]);
      }
    } finally {
      setLoading(false);
    }
  }, [storeId, onAverageRatingChange, sortBy, onReviewsLoaded]);

  useEffect(() => {
    if (!storeId) return;
    loadReviews();
  }, [storeId, sortBy]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>리뷰를 불러오는 중...</Text>
      </View>
    );
  }

  // 리뷰 작성 날짜
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // 유효하지 않으면 빈 문자열
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0',
    )}-${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* ⭐ 평균 별점 UI 원복 ⭐ */}
      {showAverage && averageRating !== null && (
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
          <Text
            style={{
              fontSize: 17.5,
              fontWeight: 'bold',
              marginRight: 10,
              marginTop: 40,
              marginLeft: 1,
              marginBottom: 20,
            }}>
            {Math.floor(averageRating) + '.0'}
          </Text>
          {Array.from({length: 5}, (_, i) => (
            <Text
              key={i}
              style={{
                fontSize: 22,
                color: i < Math.floor(averageRating) ? '#FF5A5F' : '#ccc', // 빨간색 별
                marginTop: 37,
                marginBottom: 20,
              }}>
              ★
            </Text>
          ))}
        </View>
      )}
      {/* ⭐ // 평균 별점 UI 원복 끝 ⭐ */}

      {reviews.length === 0 ? (
        <Text style={styles.noReviewsText}>작성된 리뷰가 없습니다.</Text>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item, index) =>
            item && item.id ? item.id.toString() : index.toString()
          }
          renderItem={({item}) => {
            if (!item) {
              console.warn('FlatList renderItem: item is undefined or null');
              return null;
            }

            return (
              <View style={styles.reviewItem}>
                {/* 상단: 닉네임 + 별점 */}
                <View style={styles.reviewHeader}>
                  <View style={{flexDirection: 'column'}}>
                    <Text style={styles.nickname}>{item.nickname}</Text>
                    <Text style={styles.reviewDate}>
                      {formatDate(item.created_at)}
                    </Text>
                  </View>
                  <View style={styles.starRatingContainer}>
                    {Array.from({length: 5}, (_, i) => (
                      <Text
                        key={i}
                        style={{
                          fontSize: 16,
                          color: i < item.rating ? '#FFD700' : '#ccc',
                          marginHorizontal: 1,
                        }}>
                        ★
                      </Text>
                    ))}
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: '#333',
                        marginLeft: 6,
                        marginTop: 3,
                      }}>
                      {item.rating.toFixed(1)} {/* 예: 4.0 */}
                    </Text>
                  </View>
                </View>

                {/* 코멘트 */}
                <Text style={styles.reviewComment}>{item.comment}</Text>

                {/* 이미지가 있는 경우만 표시 */}
                {item.image && (
                  <Image
                    source={{uri: item.image}}
                    style={styles.reviewImage}
                  />
                )}
              </View>
            );
          }}
          scrollEnabled={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    paddingHorizontal: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 100,
  },
  // ⭐ averageRatingContainer 스타일은 이제 필요 없습니다 (원래 UI).
  // averageRatingContainer: {
  //   backgroundColor: '#f9f9f9',
  //   padding: 15,
  //   borderRadius: 8,
  //   marginBottom: 15,
  //   alignItems: 'center',
  //   borderWidth: 1,
  //   borderColor: '#e0e0e0',
  // },
  averageRatingText: {
    // 이 스타일은 이제 사용되지 않습니다.
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  starRatingContainer: {
    // 이 스타일도 재정의 필요.
    flexDirection: 'row',
    marginBottom: 5,
  },
  // ⭐ starIcon 스타일은 이제 필요 없습니다.
  // starIcon: {
  //   marginHorizontal: 1,
  // },
  reviewCountText: {
    fontSize: 14,
    color: '#666',
  },
  noReviewsText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    marginBottom: 20,
  },
  reviewItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nickname: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  reviewDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 7,
    marginBottom: 10,
  },
  reviewComment: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 10,
  },
  reviewImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginTop: 10,
    resizeMode: 'cover',
  },
});

export default ReviewList;
