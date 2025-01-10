import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './homepage';
import LevelMapping from './level_mapping';
import Level1 from '../levels/1/level_1';
import Guide1 from '../levels/1/guide_1';
import Level2 from '../levels/2/level_2';
import Guide2 from '../levels/2/guide_2';
import Guide3 from '../levels/3/guide_3';
import Level3 from '../levels/3/level_3';
import Guide4 from '../levels/4/guide_4';
import Level4 from '../levels/4/level_4';
import Level5 from '../levels/5/level_5';
import Guide5 from '../levels/5/guide_5';
import Guide6 from '../levels/6/guide_6';
import Level6 from '../levels/6/level_6';
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
      <Stack.Screen
        name="Guide3"
        component={Guide3}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Level3"
        component={Level3}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Guide4"
        component={Guide4}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Level4"
        component={Level4}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Level5"
        component={Level5}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Guide5"
        component={Guide5}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Guide6"
        component={Guide6}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Level6"
        component={Level6}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
