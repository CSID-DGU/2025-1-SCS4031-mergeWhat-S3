// navigation/stack/CommunityNavigator.tsx
import {createStackNavigator} from '@react-navigation/stack';
import PostListScreen from '../../screens/community/PostListScreen';
import PostWriteScreen from '../../screens/community/PostWriteScreen';
import MarketSearch from '../../screens/community/MarketSearchScreen';
import {CommunityStackParamList} from '../../types/common';
import PostInfoScreen from '../../screens/community/PostInfoScreen';

const Stack = createStackNavigator<CommunityStackParamList>();

const CommunityStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="PostListScreen" component={PostListScreen} />
      <Stack.Screen name="PostWriteScreen" component={PostWriteScreen} />
      <Stack.Screen name="MarketSearchScreen" component={MarketSearch} />
      <Stack.Screen name="PostInfoScreen" component={PostInfoScreen} />
    </Stack.Navigator>
  );
};

export default CommunityStackNavigator;
