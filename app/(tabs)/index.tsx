import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './homepage';
import LevelMapping from './level_mapping';
import Level1 from '../levels/1/level_1';
import Guide1 from '../levels/1/guide_1';
import Level1Listening from '../levels/1/level_1_listening';

const Stack = createStackNavigator();

export default function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomePage"
        component={HomePage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LevelMapping"
        component={LevelMapping}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Guide1"
        component={Guide1}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Level1"
        component={Level1}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Level1Listening"
        component={Level1Listening}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
