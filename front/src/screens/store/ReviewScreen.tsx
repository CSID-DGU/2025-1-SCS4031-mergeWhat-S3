import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {ReviewStackParamList} from '../../types/common';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import useAuth from '../../hooks/queries/useAuth';
import {authNavigations} from '../../constants/navigations';
import {StackNavigationProp} from '@react-navigation/stack';
import {AuthStackParamList} from '../../navigations/stack/AuthStackNavigator';
import {submitReview} from '../../api/review';

const emptyStars = require('../../assets/review_star.png');

type ReviewRouteProp = RouteProp<ReviewStackParamList, 'ReviewScreen'>;

const AnimatedStar = ({
  index,
  selectedRating,
  onPress,
}: {
  index: number;
  selectedRating: number;
  onPress: () => void;
}) => {
  const animatedValue = useSharedValue(selectedRating >= index + 1 ? 1 : 0);

  // 매번 업데이트
  useEffect(() => {
    animatedValue.value = withTiming(selectedRating >= index + 1 ? 1 : 0, {
      duration: 200,
    });
  }, [selectedRating]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      color: animatedValue.value ? '#FFD700' : '#ccc',
      transform: [{scale: animatedValue.value ? 1.2 : 1}],
    };
  });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Animated.Text style={[styles.starText, animatedStyle]}>★</Animated.Text>
    </TouchableOpacity>
  );
};

const ReviewScreen = ({route}: {route: ReviewRouteProp}) => {
  const navigation = useNavigation<any>();

  //const navigation = useNavigation();
  const {storeName, storeId} = route.params;

  const [rating, setRating] = useState(0); // 0 ~ 5
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState('');
  const [file, setFile] = useState<any>(null);

  const handleImagePick = () => {
    launchImageLibrary({mediaType: 'photo', quality: 0.8}, response => {
      if (response.didCancel) return;
      const asset = response.assets?.[0];
      if (
        asset &&
        (asset.type === 'image/jpeg' || asset.type === 'image/png')
      ) {
        setPreview(asset.uri || '');
        setFile(asset);
      } else {
        Alert.alert('jpg, png 형식의 이미지 파일만 업로드 가능합니다.');
      }
    });
  };

  const handleRatingPress = (e: any) => {
    const starWidth = 160 / 5;
    const tapX = e.nativeEvent.locationX;
    const selectedRating = Math.ceil(tapX / starWidth);
    setRating(selectedRating);
  };

  const handleSubmit = async () => {
    if (!content || rating === 0) {
      Alert.alert('별점과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      await submitReview(storeId, rating, content, file?.uri);
      Alert.alert('리뷰가 성공적으로 등록되었습니다.');
      navigation.goBack();
    } catch (err) {
      console.error('❌ 리뷰 전송 실패:', err);
      Alert.alert('리뷰 등록 실패', '잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{storeName}</Text>
        <TouchableOpacity onPress={handleSubmit}>
          <Ionicons name="checkmark" size={26} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* 별점 영역 */}
        <View style={styles.starRow}>
          {[0, 1, 2, 3, 4].map(i => (
            <AnimatedStar
              key={i}
              index={i}
              selectedRating={rating}
              onPress={() => setRating(i + 1)}
            />
          ))}
        </View>

        {/* 리뷰 내용 */}
        <TextInput
          style={styles.textarea}
          placeholder="글을 입력해주세요... (200자 이내)"
          multiline
          maxLength={200}
          value={content}
          onChangeText={setContent}
        />

        {/* 이미지 업로드 박스 */}
        <View style={styles.imageUploadContainer}>
          <TouchableOpacity style={styles.imageBox} onPress={handleImagePick}>
            <Text style={{fontSize: 24}}>📷</Text>
            <Text style={styles.imageCountText}>{file ? '1/1' : '0/1'}</Text>
          </TouchableOpacity>

          {preview && (
            <Image source={{uri: preview}} style={styles.imagePreview} />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: {
    padding: 24,
    backgroundColor: '#fff',
  },

  starText: {
    fontSize: 30,
    marginHorizontal: 4,
  },
  starRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },

  ratingContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  starImage: {
    width: 160,
    height: 32,
  },
  starOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 160,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    height: 160,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  imageUploadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageBox: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  imageCountText: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
  },
  imagePreview: {
    width: 72,
    height: 72,
    borderRadius: 8,
  },
});

export default ReviewScreen;
