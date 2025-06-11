import React, { useState } from "react";
import { View, Button, Text, ScrollView } from "react-native";
import BirdRace from "../components/BirdRace";
import SurvivalGame from "../components/SurvivalGame";
import globalStyles from "../styles";

export default function GameScreen() {
  const [mode, setMode] = useState(null);
  const [result, setResult] = useState(null);

  const handleFinish = res => { setResult(res); setMode(null); };

  if (!mode) {
    return (
      <View style={globalStyles.container}>
        <Button title="Bird Race" onPress={()=>{setResult(null);setMode('race')}} />
        <Button title="Survival!" onPress={()=>{setResult(null);setMode('survival')}} />
        {result && (
          <ScrollView style={{ marginTop:20 }}>
            {result.error && <Text>{result.error}</Text>}
            {!result.error && mode==='race' && (
              result.tie
                ? <Text>It's a tie! Both birds performed equally.</Text>
                : <Text>Winner: {result.winner.name}</Text>
            )}
            {!result.error && mode==='survival' && (
              <>
                <Text style={{ fontWeight:'bold' }}>
                  {result.winner?`Winner in ${result.env}: ${result.winner.name}`:"It's a tie!"}
                </Text>
                <Text style={{ marginTop:10, fontWeight:'600' }}>Reasons:</Text>
                {result.reasons.map((r,i)=><Text key={i}>• {r}</Text>)}
              </>
            )}
          </ScrollView>
        )}
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      {mode==='race' && <BirdRace onFinish={handleFinish} />}
      {mode==='survival' && <SurvivalGame onFinish={handleFinish} />}
    </View>
  );
}
