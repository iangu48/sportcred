import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import DisplayExample from '../controller/ExampleController';

const Stack = createStackNavigator();

// todo replace screens with user registration / login controllers

export default function LoggedOutStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode={'none'}>
        <Stack.Screen name="Login" component={DisplayExample} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
