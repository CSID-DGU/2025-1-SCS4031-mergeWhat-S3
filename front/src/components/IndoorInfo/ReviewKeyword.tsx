// components/IndoorInfo/ReviewKeywords.tsx

import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native'; // TouchableOpacity 추가
import {fetchStoreKeywordsByStoreId} from '../../api/review'; // API 함수 및 타입 임포트
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StoreKeyword} from '../../types/common';

interface ReviewKeywordsProps {
  storeId: number;
  totalReviewsCount: number;
}

const screenWidth = Dimensions.get('window').width;
const MAX_BAR_WIDTH_RATIO = 0.7; // 막대 그래프의 최대 너비 비율

const ReviewKeywords: React.FC<ReviewKeywordsProps> = ({
  storeId,
  totalReviewsCount,
}) => {
  const [keywords, setKeywords] = useState<StoreKeyword[]>([]);
  const [showAllKeywords, setShowAllKeywords] = useState(false); // 토글 상태
  const displayKeywords = showAllKeywords ? keywords : keywords.slice(0, 3); // 3개만 표시

  useFocusEffect(
    useCallback(() => {
      const loadKeywords = async () => {
        try {
          const data = await fetchStoreKeywordsByStoreId(storeId);
          // frequency 기준으로 내림차순 정렬
          const sortedData = data.sort((a, b) => b.frequency - a.frequency);
          setKeywords(sortedData);
        } catch (error) {
          console.error('❌ 키워드 불러오기 실패:', error);
          setKeywords([]);
        }
      };

      if (storeId) {
        loadKeywords();
      }
    }, [storeId]),
  );

  if (keywords.length === 0) {
    return (
      <View style={[styles.container, styles.noKeywordsContainer]}>
        <Text style={styles.title}>리뷰 키워드 분석</Text>
        <Text style={styles.noKeywordsText}>
          아직 분석된 키워드가 없습니다.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>리뷰 키워드 분석</Text>
      {displayKeywords.map((item, index) => {
        // 막대 그래프 너비 계산: frequency / totalReviewsCount
        const barPercentage =
          totalReviewsCount > 0 ? item.frequency / totalReviewsCount : 0;
        const barWidth = barPercentage * screenWidth * MAX_BAR_WIDTH_RATIO;
        const displayFrequency = item.frequency.toLocaleString(); // 숫자에 쉼표 추가

        return (
          <View key={item.id || index} style={styles.keywordItem}>
            <View style={styles.keywordTextContainer}>
              <Text style={styles.keyword}>{item.keyword}</Text>
              <Text style={styles.frequency}>{displayFrequency}개</Text>{' '}
              {/* '개' 추가 */}
            </View>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, {width: barWidth}]} />
            </View>
          </View>
        );
      })}

      {/* 3개 초과 시 토글 버튼 */}
      {keywords.length > 3 && (
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowAllKeywords(!showAllKeywords)}>
          <Text style={styles.toggleButtonText}>
            {showAllKeywords ? '▲ 접기' : '▽ 더보기'}
          </Text>
          <Icon
            name={showAllKeywords ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={20}
            color="#555"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15, // IndoorInfoSheet에서 패딩을 줄 예정이지만, 컴포넌트 자체 패딩도 고려
    marginTop: 20,
    marginBottom: 20, // reviewSortButtons 위에 있으므로 여백 추가
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 15, // 위아래 패딩
    backgroundColor: '#ffffff',
  },
  noKeywordsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  keywordItem: {
    marginBottom: 12, // 각 키워드 항목 사이 간격
  },
  keywordTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  keyword: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
    flexShrink: 1, // 텍스트가 길어질 경우 줄 바꿈 허용
  },
  frequency: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  progressBarBackground: {
    height: 8, // 원통 두께
    backgroundColor: '#e0e0e0', // 회색 배경 (채워지지 않은 부분)
    borderRadius: 4, // 둥근 모서리
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFD700', // 채워지는 부분 색상 (금색)
    borderRadius: 4, // 둥근 모서리
  },
  noKeywordsText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 10,
    marginBottom: 10,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingVertical: 5,
  },
  toggleButtonText: {
    fontSize: 14,
    color: '#555',
    marginRight: 5,
  },
});

export default ReviewKeywords;
