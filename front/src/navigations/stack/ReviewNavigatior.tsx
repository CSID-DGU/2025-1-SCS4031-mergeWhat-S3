import {createStackNavigator} from '@react-navigation/stack';
import IndoorInfoSheet from '../../screens/map/IndoorInfoSheet';
import ReviewScreen from '../../screens/map/ReviewScreen';
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
