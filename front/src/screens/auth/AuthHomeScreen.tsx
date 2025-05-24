import React from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {Dimensions, Image, SafeAreaView, StyleSheet, View} from 'react-native';
import {AuthStackParamList} from '../../navigations/stack/AuthStackNavigator';
import CustomButton from '../../components/CustomButton';
import {authNavigations} from '../../constants/navigations';
import Ionicons from 'react-native-vector-icons/Ionicons';

type AuthHomeScreenProps = StackScreenProps<
  AuthStackParamList,
  typeof authNavigations.AUTH_HOME
>;

function AuthHomeScreen({navigation}: AuthHomeScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          resizeMode="contain"
          style={styles.image}
          source={require('../../assets/logo.png')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          label="카카오 로그인하기"
          onPress={() => navigation.navigate(authNavigations.KAKAO)}
          style={styles.kakaoButtonConatiner}
          textStyle={styles.kakaoButtonText}
          icon={
            <Ionicons name={'chatbubble-sharp'} color={'#181500'} size={16} />
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 30,
    marginVertical: 30,
  },
  imageContainer: {
    flex: 1.5,
    width: Dimensions.get('screen').width / 2,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    flex: 1,
    width: '100%',
    //alignItems: 'center',
    gap: 10,
  },
  kakaoButtonConatiner: {
    backgroundColor: '#FEE503',
  },
  kakaoButtonText: {
    color: '#181600',
  },
});

export default AuthHomeScreen;
