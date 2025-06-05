import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Provider as PaperProvider } from "react-native-paper";

import HomeScreen from "./screens/HomeScreen";
import DatabaseScreen from "./screens/DatabaseScreen";
import ProfileScreen from "./screens/ProfileScreen";
import FlockBirdsScreen from "./screens/FlocksScreen";
import GameScreen from './screens/GameScreen';
import ImageRecognitionScreen from "./screens/ImageRecognitionScreen";

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <PaperProvider>
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Database" component={DatabaseScreen} />
        <Drawer.Screen name="Flocks" component={FlockBirdsScreen} />
<Drawer.Screen name="Game Screen" component={GameScreen} options={{ title: 'Bird Race' }} />
<Drawer.Screen name="Identfy Bird" component={ImageRecognitionScreen} options={{ title: 'Identify Bird' }} />

        <Drawer.Screen name="Profile" component={ProfileScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
    </PaperProvider>
  );
}
