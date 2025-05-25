// navigation/stack/CommunityNavigator.tsx
import {createStackNavigator} from '@react-navigation/stack';
import PostListScreen from '../../screens/community/PostListScreen';
import PostWriteScreen from '../../screens/community/PostWriteScreen';
import IndoorInfoSheet from '../../screens/store/IndoorInfoSheet';

const Stack = createStackNavigator();

const CommunityStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="PostListScreen" component={PostListScreen} />
      <Stack.Screen name="PostWriteScreen" component={PostWriteScreen} />
    </Stack.Navigator>
  );
};

export default CommunityStackNavigator;
