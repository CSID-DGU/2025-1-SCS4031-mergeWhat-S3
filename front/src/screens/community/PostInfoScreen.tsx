import React from 'react'; // useState, useEffect는 현재 사용되지 않으므로 제거
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
  // ActivityIndicator, // 현재 사용되지 않으므로 제거
  TextInput,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CommunityStackParamList, Post, Comment} from '../../types/common';
import {useState, useEffect} from 'react';
import {fetchCommentsByPostId, createComment} from '../../api/post'; // <-- 기존 코드에 추가

const {width: screenWidth} = Dimensions.get('window');

type PostInfoScreenNavigationProp = StackNavigationProp<
  CommunityStackParamList,
  'PostInfoScreen'
>;

type PostInfoScreenRouteProp = RouteProp<
  CommunityStackParamList,
  'PostInfoScreen'
>;

const PostInfoScreen = () => {
  const navigation = useNavigation<PostInfoScreenNavigationProp>();
  const route = useRoute<PostInfoScreenRouteProp>();
  const {post} = route.params;

  // board_type을 한글 제목으로 매핑하는 객체
  const boardTypeToTitleMap: {[key: string]: string} = {
    course: '시장로드맵',
    produce: '농수산물',
    food: '먹거리',
    fashion: '옷',
    etc: '기타 품목',
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await fetchCommentsByPostId(post.id);
        setComments(data);
      } catch (error) {
        console.error('댓글 불러오기 오류:', error);
      }
    };
    loadComments();
  }, [post.id]);

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    try {
      const newComment = await createComment(post.id, 3, commentText); // user_id 하드코딩된 상태
      setComments(prev => [newComment, ...prev]); // 새 댓글 추가
      setCommentText('');
    } catch (error) {
      console.error('댓글 작성 실패:', error);
    }
  };

  // post가 없으면 로딩 인디케이터 대신 에러 메시지 표시
  if (!post) {
    return (
      <View style={styles.loadingContainer}>
        <Text>게시물 정보를 불러오지 못했습니다.</Text>
      </View>
    );
  }

  // 게시판 제목을 post.board_type에 따라 동적으로 가져오기
  // board_typeToTitleMap에 해당 board_type이 없으면 기본값 '알 수 없음'으로 표시
  const boardTitle =
    boardTypeToTitleMap[post.board_type] || '알 수 없는 게시판';

  // -----------------------------------------------------------------

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
        {/* boardTitle 변수를 사용하여 게시판 제목 동적 변경 */}
        <Text style={styles.headerTitle}>{boardTitle} 게시판</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        {/* 작성자 정보 */}
        <View style={styles.userInfo}>
          <Image
            source={
              post.user?.profile_url
                ? {uri: post.user.profile_url}
                : require('../../assets/채현_프로필.jpg')
            }
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.nickname}>{post.user?.nickname || '채현'}</Text>
            <Text style={styles.timestamp}>{formatDate(post.created_at)}</Text>
          </View>
        </View>

        {/* 게시물 내용 */}
        <View style={styles.postContentSection}>
          <Text style={styles.postTitle}>{post.title}</Text>
          <Text style={styles.postContent}>{post.content}</Text>

          {/* 게시물 이미지 (있을 경우) */}
          {post.images && post.images.length > 0 && (
            <View style={styles.imageContainer}>
              {post.images.map((image, index) =>
                image.postImage_url ? (
                  <Image
                    key={image.id || index}
                    source={{uri: image.postImage_url}}
                    style={styles.postImage}
                    resizeMode="cover"
                  />
                ) : null,
              )}
            </View>
          )}
        </View>

        {/* 좋아요 버튼 (클릭 로직 없이 UI만 표시) */}
        <TouchableOpacity style={styles.likeButton}>
          <Text style={styles.likeText}>🤍 좋아요 0개</Text>
        </TouchableOpacity>

        {/* 댓글 섹션 (향후 구현 예정) */}
        <View style={styles.commentSection}>
          <Text style={styles.commentHeader}>댓글</Text>

          {comments.length === 0 ? (
            <Text style={styles.noCommentsText}>아직 댓글이 없습니다.</Text>
          ) : (
            comments.map(comment => (
              <View key={comment.id} style={{marginBottom: 12}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={
                      comment.user?.profile_url
                        ? {uri: comment.user.profile_url}
                        : require('../../assets/원혁_프로필.jpg')
                    }
                    style={styles.profileImage}
                  />
                  <View>
                    <Text style={styles.nickname}>
                      {comment.user?.nickname || '장원혁'}
                    </Text>
                    <Text style={styles.timestamp}>
                      {formatDate(comment.created_at)}
                    </Text>
                  </View>
                </View>
                <Text style={{marginLeft: 50, color: '#333', marginTop: 4}}>
                  {comment.content}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* 댓글 입력창 (하단 고정) */}
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="댓글 달기"
          placeholderTextColor="#999"
          value={commentText}
          onChangeText={setCommentText}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleCommentSubmit}>
          <Ionicons name="arrow-up-circle" size={30} color="#3366FF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  moreButton: {
    padding: 5,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
  },
  nickname: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  postContentSection: {
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 17,
  },
  postContent: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  imageContainer: {
    marginTop: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  postImage: {
    width: screenWidth - 32,
    height: 250,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  likeText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  commentSection: {
    padding: 16,
    flex: 1,
  },
  commentHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  noCommentsText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    minHeight: 60,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    fontSize: 14,
    color: '#333',
    marginRight: 10,
  },
  sendButton: {
    padding: 5,
  },
});

export default PostInfoScreen;
