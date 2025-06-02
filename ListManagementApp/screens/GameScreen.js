
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import GameEngine from '../components/GameEngine';
import globalStyles from "../styles";

export default function GameScreen({ navigation }) {
  const [playing, setPlaying] = React.useState(false);

  return (
    <View style={globalStyles.container}>
      {!playing ? (
        <Button title="Start Challenge" onPress={() => setPlaying(true)} />
      ) : (
        <>
          <GameEngine onGameOver={() => setPlaying(false)} />
          <Button title="Quit" onPress={() => setPlaying(false)} />
        </>
      )}
    </View>
  );
}


