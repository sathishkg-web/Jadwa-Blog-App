import { Text, SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BlogEditScreen from '../screens/BlogEditScreen';
import HomeScreen from '../screens/HomeScreen';

const stack = createStackNavigator();

export default function HomeNavigation() {
  return (
      <stack.Navigator initialRouteName="StackHome">
        <stack.Screen name="StackHome" component={HomeScreen} options={{headerShown:false}}/>
        <stack.Screen name="Edit Blog" component={BlogEditScreen} options={{headerShown:true}}/>
      </stack.Navigator>
  );
}

