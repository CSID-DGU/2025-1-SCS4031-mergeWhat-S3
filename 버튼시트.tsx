import React, {useEffect, useRef, useState, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';


            <Text style={[styles.sectionTitle, styles.categoryTitle]}>
              카테고리
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[styles.buttonRow, {paddingRight: 12}]}>
              {['🥬 농수산물', '🍡 먹거리', '👕 옷', '🎎 혼수'].map(label => {
                const pure = label.replace(/[^가-힣]/g, '');

                return (
                  <CategoryButton
                    key={pure}
                    label={label}
                    onPress={() => handleCategoryPress(pure)}
                    isSelected={selectedCategory === pure}
                  />
                );
              })}
              
              {/* 모든 가게 보기 버튼도 여기에 포함 */}
              {selectedCategory !== null && (
                <CategoryButton
                  label="모든 가게 보기"
                  onPress={() => handleCategoryPress(null)}
                  isSelected={false}
                />
              )}
            </ScrollView>

            <View style={[styles.buttonRow, {marginTop: 4}]}>
              <CategoryButton
                label="💳 가맹점"
                onPress={() => handleCategoryPress('가맹점')}
                isSelected={selectedCategory === '가맹점'}
              />
            </View>

            <Text style={[styles.sectionTitle, styles.nearbyTitle]}>
              주변 정보
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[styles.buttonRow, {marginBottom: 10}]}>
              {['🚗 주차장', '🚻 화장실', '🎡 근처 놀거리'].map(label => {
                const pure = label.replace(/[^가-힣]/g, '');
                return (
                  <CategoryButton
                    key={pure}
                    label={label}
                    onPress={() => handleCategoryPress(pure)}
                    isSelected={selectedCategory === pure}
                  />
                );
              })}
            </ScrollView>


const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  categoryTitle: {marginTop: -5},
  nearbyTitle: {marginTop: 17},
  marketTitle: {marginTop: 17},
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 4,
    paddingHorizontal: 2,
  },
  button: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  storeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -10,
    marginBottom: 0,
  },
  buttonSelected: {
    backgroundColor: '#e0f0ff',
    borderColor: '#91AEFF',
  },
  buttonText: {
    fontSize: 13,
    color: '#333',
  },
  storeCard: {marginBottom: 24},

  storeImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 18,
  },

  storeName: {fontSize: 16, fontWeight: '600'},
  storeDesc: {fontSize: 13, color: '#555', marginBottom: 4},
  storeDistance: {color: '#f55', fontSize: 13, fontWeight: '500'},

  storeAffiliate: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3366ff',
    marginLeft: 8,
    marginTop: 2.5,
  },
  storeNameTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    marginLeft: 0,
    textAlign: 'center',
  },
  tabRow: {flexDirection: 'row', justifyContent: 'center', marginBottom: 12},
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 4,
  },
  tabButtonSelected: {backgroundColor: '#ffcc33', borderColor: '#ffcc33'},
  tabText: {fontSize: 14, fontWeight: '500'},
  storeInfoBox: {paddingHorizontal: 12},
  storeAddress: {marginTop: 5, fontSize: 14, marginBottom: 13},
  storeTime: {fontSize: 14, color: 'orange', marginBottom: 4},

  storeContact: {marginTop: 5, fontSize: 14, marginBottom: -20},

  // 추가된 스타일
  noStoreText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 15,
    color: '#888',
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  productItem: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
  },
  businessHourContainer: {
    marginBottom: 10,
    marginTop: 10,
  },
  businessHourRow: {
    fontSize: 13,
    color: '#666',
    marginLeft: 10,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  reviewSortButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  sortButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
  },
  sortButtonSelected: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#3366FF',
    backgroundColor: '#E6F0FF',
    marginRight: 8,
  },
  sortButtonText: {
    fontSize: 13,
    color: '#555',
  },
  sortButtonTextSelected: {
    fontSize: 13,
    color: '#3366FF',
    fontWeight: 'bold',
  },
  reviewInputContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
});

export default IndoorInfoSheet;
