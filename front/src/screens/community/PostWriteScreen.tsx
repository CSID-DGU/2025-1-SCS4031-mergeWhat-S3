import React, {useState} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PostWriteScreen = () => {
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [rate, setRate] = useState('');
  const [category, setCategory] = useState('');
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

  const handleImageDelete = () => {
    Alert.alert('이미지 삭제', '이미지를 삭제하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {text: '삭제', onPress: () => setPreview('')},
    ]);
  };

  const handleSubmit = () => {
    if (!title || !price || !rate || !category || !content || !file) {
      Alert.alert('모든 항목을 입력해주세요.');
      return;
    }

    Alert.alert('작성 완료', '게시물이 작성되었습니다.');
    // navigation.goBack(); // 실제 등록 후 이동
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {/* 🔙 헤더 */}
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
            onPress={handleImagePick}>
            <Text style={{fontSize: 28}}>📷</Text>
          </TouchableOpacity>
          {preview ? (
            <>
              <Image source={{uri: preview}} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.deleteIcon}
                onPress={handleImageDelete}>
                <Text style={{color: '#F74D1B', fontSize: 20}}>🗑</Text>
              </TouchableOpacity>
            </>
          ) : null}
        </View>

        {/* 입력 항목들 */}
        <View style={styles.formSection}>
          <Text style={styles.label}>제목</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={text => setTitle(text)}
            placeholder="제목을 입력하세요"
          />

          <Text style={styles.label}>카테고리</Text>
          <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            placeholder="리뷰 , 정보/질문"
          />

          <Text style={styles.label}>내용</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={content}
            multiline
            onChangeText={setContent}
            placeholder="내용을 입력하세요"
          />
        </View>

        {/* 하단 여백 확보 + 버튼 아래 고정 */}
        <View style={{marginTop: 40, marginBottom: 80}}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>글 작성하기</Text>
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
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  deleteIcon: {
    marginLeft: 8,
    justifyContent: 'center',
  },
  formSection: {
    marginBottom: 30,
  },
  label: {
    marginBottom: 4,
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
