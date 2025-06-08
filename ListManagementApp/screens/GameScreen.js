import React, { useState } from "react";
import { View, Button, Text } from "react-native";
import BirdRace from "../components/BirdRace";
import globalStyles from "../styles";

export default function GameScreen() {
  const [playing, setPlaying] = useState(false);
  const [result, setResult] = useState(null);

  const handleFinish = (res) => {
    setPlaying(false);
    setResult(res);
  };

  return (
    <View style={globalStyles.container}>
          {playing ? (
        <BirdRace onFinish={handleFinish} />
      ) : (
        <>
          {result && !result.error && (
            <Text style={{ marginBottom: 10 }}>
              {result.tie
                ? `It's a tie! Both went ${result.dist1.toFixed(2)} km`
                : `Winner: ${result.winner.name} with ${result.winner.speed.toFixed(2)} km/s`}
            </Text>
          )}
          {result && result.error && (
            <Text style={{ marginBottom: 10 }}>{result.error}</Text>
          )}
          <Button
            title="Start Race"
            onPress={() => {
              setResult(null);
              setPlaying(true);
            }}
          />
        </>
      )}
    </View>
  );
}


