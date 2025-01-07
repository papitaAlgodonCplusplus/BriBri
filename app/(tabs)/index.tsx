import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './homepage';
import LevelMapping from './level_mapping';
import Level1 from '../levels/1/level_1';
import Guide1 from '../levels/1/guide_1';
import Level2 from '../levels/2/level_2';
import Guide2 from '../levels/2/guide_2';
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
        name="Guide2"
        component={Guide2}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Level2"
        component={Level2}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
