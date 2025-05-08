// 사용자가 가장먼저 마주하게 되는 로직들

import AuthStackNavigator from './stack/AuthStackNavigator';
import MainBottomTab from './MainBottomTab';
import useAuth from '../hooks/queries/useAuth';

function RootNavigator() {
  return <MainBottomTab />;
}

export default RootNavigator;
