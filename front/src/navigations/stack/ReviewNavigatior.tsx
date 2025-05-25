import {createStackNavigator} from '@react-navigation/stack';
import IndoorInfoSheet from '../../screens/store/IndoorInfoSheet';
import ReviewScreen from '../../screens/store/ReviewScreen';
import {ReviewStackParamList} from '../../types/common';

const Stack = createStackNavigator<ReviewStackParamList>();

const CommunityStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ReviewScreen" component={ReviewScreen} />
    </Stack.Navigator>
  );
};

export default CommunityStackNavigator;
