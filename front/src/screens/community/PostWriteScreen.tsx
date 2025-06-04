import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {useNavigation, useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {createPost, uploadPostImage} from '../../api/post';

const categoryOptions = ['시장로드맵', '농수산물', '먹거리', '옷', '기타 품목'];

const categoryMap: {[key: string]: string} = {
  시장로드맵: 'course',
  자유게시판: 'free',
  농수산물: 'produce',
  먹거리: 'food',
  옷: 'fashion',
  '기타 품목': 'etc',
};

const PostWriteScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const initialCategory =
    (route.params as {defaultCategory?: string})?.defaultCategory || '';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState('');
  const [file, setFile] = useState<any>(null);
  const [category, setCategory] = useState(initialCategory);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [initialCategory]);

  const handleImagePick = () => {
    launchImageLibrary({mediaType: 'photo', quality: 0.8}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        return;
      }
      if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('이미지 선택 오류', '이미지 선택 중 오류가 발생했습니다.');
        return;
      }

      const asset = response.assets?.[0];
      if (
        asset &&
        asset.uri &&
        (asset.type === 'image/jpeg' || asset.type === 'image/png')
      ) {
        setPreview(asset.uri);
        setFile(asset);
      } else {
        Alert.alert(
          '유효하지 않은 파일',
          'jpg, png 형식의 이미지 파일만 업로드 가능합니다.',
        );
      }
    });
  };

  const handleImageDelete = () => {
    Alert.alert('이미지 삭제', '이미지를 삭제하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {
        text: '삭제',
        onPress: () => {
          setPreview('');
          setFile(null);
        },
      },
    ]);
  };

  const handleSubmit = async () => {
    if (!title || !category || !content) {
      Alert.alert('필수 입력', '모든 항목을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const postId = await createPost(title, content, category);
      console.log('게시글 생성 완료, postId:', postId);

      if (file) {
        console.log('이미지 업로드 시작');
        await uploadPostImage(postId, file);
        console.log('이미지 업로드 완료');
      }

      Alert.alert('작성 완료', '게시물이 성공적으로 작성되었습니다.');
      navigation.goBack();
    } catch (err) {
      console.error('❌ 게시물 등록 실패:', err);
      Alert.alert(
        '오류',
        '게시물 작성 중 오류가 발생했습니다. 다시 시도해주세요.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>게시물 작성</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* 썸네일 업로드 */}
        <View style={styles.imageContainer}>
          <TouchableOpacity
            style={styles.imageUpload}
            onPress={handleImagePick}
            disabled={isLoading}>
            <Text style={{fontSize: 28}}>📷</Text>
          </TouchableOpacity>
          {preview ? (
            // 이미지와 삭제 버튼을 감싸는 새로운 View 추가
            <View style={styles.imagePreviewWrapper}>
              <Image source={{uri: preview}} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleImageDelete}
                disabled={isLoading}>
                <Text style={styles.deleteButtonText}>X</Text>{' '}
                {/* ✅ 'X' 텍스트로 변경 */}
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>카테고리</Text>
          <View style={styles.categoryOptions}>
            {categoryOptions.map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.categoryOption,
                  category === option && styles.categorySelected,
                ]}
                onPress={() => setCategory(option)}
                disabled={isLoading}>
                <Text
                  style={
                    category === option
                      ? styles.categorySelectedText
                      : styles.categoryText
                  }>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>제목</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="제목을 입력하세요"
            editable={!isLoading}
          />

          <Text style={styles.label}>내용</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={content}
            multiline
            onChangeText={setContent}
            placeholder="내용을 입력하세요"
            editable={!isLoading}
          />
        </View>

        <View style={{marginTop: 40, marginBottom: 80}}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>글 작성하기</Text>
            )}
          </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  imageUpload: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  // 이미지와 삭제 버튼을 감싸는 View의 스타일
  imagePreviewWrapper: {
    position: 'relative', // 자식 요소인 deleteButton의 absolute 위치를 위한 기준
    width: 80, // imagePreview와 동일한 너비
    height: 80, // imagePreview와 동일한 높이
    borderRadius: 8,
  },
  imagePreview: {
    width: '100%', // 부모 wrapper에 맞춰 100%
    height: '100%', // 부모 wrapper에 맞춰 100%
    borderRadius: 8,
  },

  deleteButton: {
    position: 'absolute', // 이미지 위에 겹치도록
    top: -8, // 상단에서 약간 위로
    right: -8, // 우측에서 약간 밖으로
    backgroundColor: '#FF0000', // 빨간색 배경
    borderRadius: 12, // 원형 버튼
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // 이미지보다 위에 오도록
    borderWidth: 1.5, // 테두리 추가
    borderColor: '#fff', // 흰색 테두리
  },
  deleteButtonText: {
    color: '#fff', // 흰색 'X'
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 18, // 텍스트 중앙 정렬을 위해 조정
  },

  formSection: {
    marginBottom: 30,
  },
  label: {
    marginBottom: 10,
    color: '#666',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
    fontSize: 15,
  },
  textarea: {
    height: 250,
    textAlignVertical: 'top',
  },
  categoryOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
    marginTop: 7,
  },
  categoryOption: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  categorySelected: {
    backgroundColor: '#E0E8FF',
    borderColor: '#3366FF',
  },
  categorySelectedText: {
    color: '#3366FF',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#3366FF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PostWriteScreen;
