import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {EditStackParamList} from '../../types/common';

// 타입 명시
type Props = StackScreenProps<EditStackParamList, 'EditScreen'>;

const EditInformationScreen = ({route, navigation}: Props) => {
  const {
    storeName,
    storeId,
    storeCategory,
    storeAddress,
    storeContact,
    storeBusinessHours,
  } = route.params;

  const [showBusinessHours, setShowBusinessHours] = useState(false);

  const handleMissingPlace = () => {
    Alert.alert('알림', '검토 후 빠른 시일내에 수정하겠습니다.');
  };

  const renderRow = (icon: string, text: string, onPress?: () => void) => (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <Ionicons name={icon} size={18} color="#4a75f4" style={styles.icon} />
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>정보수정제안</Text>
        <TouchableOpacity onPress={() => Alert.alert('수정 완료')}>
          <Ionicons name="checkmark" size={26} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{padding: 20}}>
        {renderRow('home-outline', storeName)}
        {renderRow('list-outline', storeCategory)}
        {renderRow('location-outline', storeAddress)}

        <TouchableOpacity
          onPress={() => setShowBusinessHours(prev => !prev)}
          style={styles.row}>
          <Ionicons
            name="time-outline"
            size={18}
            color="#4a75f4"
            style={styles.icon}
          />
          <Text style={styles.text}>영업 중 - 오후 11:00에 영업 종료</Text>
        </TouchableOpacity>

        {showBusinessHours && (
          <View style={{marginLeft: 28, marginTop: 6}}>
            {storeBusinessHours.map((item, index) => (
              <Text key={index} style={styles.hoursText}>
                {item.day} {item.open}~{item.close}
              </Text>
            ))}
          </View>
        )}

        {renderRow('call-outline', storeContact)}

        {/* 장소 없음 제안 */}
        <TouchableOpacity onPress={handleMissingPlace} style={{marginTop: 30}}>
          <Text
            style={{
              color: '#4a75f4',
              fontSize: 14,
              textDecorationLine: 'underline',
              marginLeft: 86,
            }}>
            장소가 폐업했거나 여기에 없음
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  icon: {
    marginRight: 12,
  },
  text: {
    fontSize: 15,
    color: '#222',
  },
  hoursText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
});

export default EditInformationScreen;
