import {createStackNavigator} from '@react-navigation/stack';
import IndoorInfoSheet from '../../screens/store/IndoorInfoSheet';

import EditInformationScreen from '../../screens/store/Edit_information_Screen';
import {EditStackParamList} from '../../types/common';

const Stack = createStackNavigator<EditStackParamList>();

const EditNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="EditScreen" component={EditInformationScreen} />
    </Stack.Navigator>
  );
};

export default EditNavigator;
