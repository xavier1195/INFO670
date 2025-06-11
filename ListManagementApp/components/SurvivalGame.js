import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, ActivityIndicator, Button, ScrollView } from "react-native";
import { getBirdsFromCloud } from "../database/firebaseDatabase";
import { fetchTraitsByCommonName } from "../database/getBirdTraits";

// Assets
const bigBirdIcon = require("../assets/bigbird.png");
const littleBirdIcon = require("../assets/littlebird.png");

// Config
const ENVIRONMENTS = ["Desert", "Jungle", "Mountain", "Grassland", "Beach"];
const DURATION = 7; // seconds
const SHAKE_DURATION = 100;

const WEIGHTS = { mass: 0.2, trophic: 0.4, beak_width: 0.1, wing_length: 0.3 };
const TROPHIC_RANK = {
  Jungle: ["Omnivore","Scavenger","Herbivore","Carnivore"],
  Desert: ["Scavenger","Carnivore","Omnivore","Herbivore"],
  Mountain: ["Herbivore","Carnivore","Omnivore","Scavenger"],
  Grassland: ["Omnivore","Herbivore","Scavenger","Carnivore"],
  Beach: ["Carnivore","Omnivore","Scavenger","Herbivore"],
};
const scoreTrait = (a = 0, b = 0) => (a > b ? 1 : a < b ? 0 : 0.5);

export default function SurvivalGame({ onFinish }) {
  const [allBirds, setAllBirds] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [birdA, setBirdA] = useState(null);
  const [birdB, setBirdB] = useState(null);
  const [env, setEnv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [outcome, setOutcome] = useState(null); // { winner, reasons, env } or { error }
  const shakeA = useRef(new Animated.Value(0)).current;
  const shakeB = useRef(new Animated.Value(0)).current;

  // Load user's birds from Firebase
  useEffect(() => {
    getBirdsFromCloud()
      .then(birds => { setAllBirds(birds); setLoading(false); })
      .catch(err => setOutcome({ error: err.message }));
  }, []);

  // When user selects a bird, fetch traits and pick opponent
  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);
    setOutcome(null);
    const userBird = allBirds.find(b => b.id === selectedId);
    const opponents = allBirds.filter(b => b.id !== selectedId);
    if (!userBird || opponents.length === 0) {
      setOutcome({ error: 'No opponent available.' });
      setLoading(false);
      return;
    }
    const opponent = opponents[Math.floor(Math.random() * opponents.length)];

    Promise.all([
      fetchTraitsByCommonName(userBird.name),
      fetchTraitsByCommonName(opponent.name)
    ])
      .then(([rawA, rawB]) => {
        if (!rawA || !rawB) {
          setOutcome({ error: 'Missing trait data.' });
        } else {
          setBirdA({ ...userBird, traits: rawA });
          setBirdB({ ...opponent, traits: rawB });
          setEnv(ENVIRONMENTS[Math.floor(Math.random() * ENVIRONMENTS.length)]);
        }
        setLoading(false);
      })
      .catch(err => {
        setOutcome({ error: err.message });
        setLoading(false);
      });
  }, [selectedId]);

  // Battle logic once traits and environment are ready
  useEffect(() => {
    if (loading || !birdA || !birdB || !env) return;

    const tA = birdA.traits;
    const tB = birdB.traits;
    const reasons = [];
    let totalA = 0;
    let totalB = 0;

    // Mass component
    const mA = tA.Mass ?? 0, mB = tB.Mass ?? 0;
    const wA = tA.Wing_Length ?? 0, wB = tB.Wing_Length ?? 0;
    let massA = 1 + wA * WEIGHTS.mass - mA * WEIGHTS.mass;
    let massB = 1 + wB * WEIGHTS.mass - mB * WEIGHTS.mass;
    if (mA > wA && env !== 'Jungle') massA = 1 + mA * WEIGHTS.mass - wA * WEIGHTS.mass;
    if (mB > wB && env !== 'Jungle') massB = 1 + mB * WEIGHTS.mass - wB * WEIGHTS.mass;
    totalA += scoreTrait(massA, massB) * WEIGHTS.mass;
    totalB += scoreTrait(massB, massA) * WEIGHTS.mass;
    reasons.push(`Mass: ${massA.toFixed(2)} vs ${massB.toFixed(2)}`);

    // Trophic component
    const rank = TROPHIC_RANK[env] || [];
    const idxA = rank.indexOf(tA.Trophic_Level) >= 0 ? rank.indexOf(tA.Trophic_Level) : Math.floor(rank.length/2);
    const idxB = rank.indexOf(tB.Trophic_Level) >= 0 ? rank.indexOf(tB.Trophic_Level) : Math.floor(rank.length/2);
    const trophA = (rank.length - idxA) * WEIGHTS.trophic;
    const trophB = (rank.length - idxB) * WEIGHTS.trophic;
    totalA += scoreTrait(trophA, trophB) * WEIGHTS.trophic;
    totalB += scoreTrait(trophB, trophA) * WEIGHTS.trophic;
    reasons.push(`Trophic: ${tA.Trophic_Level || 'Unknown'} vs ${tB.Trophic_Level || 'Unknown'}`);

    // Beak width component
    const bwA = tA.Beak_Width ?? 0, bwB = tB.Beak_Width ?? 0;
    const meanBW = (bwA + bwB) / 2;
    const compBW = (val, role) => {
      switch (role) {
        case 'Scavenger': return val;
        case 'Herbivore': return -val;
        case 'Omnivore': return -Math.abs(val - meanBW);
        case 'Carnivore': return val;
        default: return 0;
      }
    };
    const bwScoreA = compBW(bwA, tA.Trophic_Level);
    const bwScoreB = compBW(bwB, tB.Trophic_Level);
    totalA += scoreTrait(bwScoreA, bwScoreB) * WEIGHTS.beak_width;
    totalB += scoreTrait(bwScoreB, bwScoreA) * WEIGHTS.beak_width;
    reasons.push(`Beak: ${bwA} vs ${bwB}`);

    // Wing length component
    const wlA = wA, wlB = wB;
    const meanWL = (wlA + wlB) / 2;
    const compWL = (val, role) => {
      switch(env) {
        case 'Jungle': return -val;
        case 'Desert': return role !== 'Herbivore' ? val : -val;
        case 'Mountain': return ['Herbivore','Omnivore'].includes(role) ? -val : val;
        case 'Grassland': return role === 'Herbivore' ? -val : val;
        case 'Beach': return -Math.abs(val - meanWL);
        default: return 0;
      }
    };
    const wlScoreA = compWL(wlA, tA.Trophic_Level);
    const wlScoreB = compWL(wlB, tB.Trophic_Level);
    totalA += scoreTrait(wlScoreA, wlScoreB) * WEIGHTS.wing_length;
    totalB += scoreTrait(wlScoreB, wlScoreA) * WEIGHTS.wing_length;
    reasons.push(`Wing: ${wlA.toFixed(1)} vs ${wlB.toFixed(1)}`);

    // Shake animations
    Animated.loop(
      Animated.sequence([
        Animated.timing(shakeA, { toValue: 1, duration: SHAKE_DURATION, useNativeDriver: true }),
        Animated.timing(shakeA, { toValue: 0, duration: SHAKE_DURATION, useNativeDriver: true })
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(shakeB, { toValue: 1, duration: SHAKE_DURATION, useNativeDriver: true }),
        Animated.timing(shakeB, { toValue: 0, duration: SHAKE_DURATION, useNativeDriver: true })
      ])
    ).start();

    // Determine winner after duration
    setTimeout(() => {
      const winner = totalA === totalB ? null : (totalA > totalB ? birdA : birdB);
      setOutcome({ winner, reasons, env });
    }, DURATION * 1000);
  }, [loading, birdA, birdB, env]);

  // Render loading
  if (loading) return <ActivityIndicator size="large" />;

  // Selection screen
  if (!selectedId && !outcome) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Choose your bird:</Text>
        <ScrollView style={{ width:'100%' }}>
          {allBirds.map(b => (
            <Button key={b.id} title={b.name} onPress={() => setSelectedId(b.id)} />
          ))}
        </ScrollView>
      </View>
    );
  }

  // Outcome screen
  if (outcome) {
    if (outcome.error) {
      return <Text style={styles.error}>{outcome.error}</Text>;
    }
    const { winner, reasons } = outcome;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {winner ? `Winner: ${winner.name}` : "It's a tie!"}
        </Text>
        <Text style={styles.subtitle}>Reasons:</Text>
        {reasons.map((r,i) => <Text key={i}>• {r}</Text>)}
        <Button title="Play Again" onPress={() => {
          setSelectedId(null);
          setBirdA(null);
          setBirdB(null);
          setEnv(null);
          setOutcome(null);
        }} />
      </View>
    );
  }

  // Battle screen

 if (!birdA || !birdB) return <ActivityIndicator size="large" />;

  const massA = birdA.traits.Mass ?? 0;
  const massB = birdB.traits.Mass ?? 0;
  const iconA = massA >= massB ? bigBirdIcon : littleBirdIcon;
  const iconB = massB > massA ? bigBirdIcon : littleBirdIcon;
  const shakeAx = shakeA.interpolate({ inputRange:[0,1], outputRange:[-5,5] });
  const shakeBx = shakeB.interpolate({ inputRange:[0,1], outputRange:[5,-5] });
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Survival! ({env})</Text>
      <View style={styles.fightRow}>
        <Animated.Image source={iconA} style={[styles.bird, {transform:[{translateX:shakeAx}]}]} />
        <Animated.Image source={iconB} style={[styles.bird, {transform:[{translateX:shakeBx}]}]} />
      </View>
      <Text style={styles.subtitle}>May the fittest survive!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding:20, alignItems:"center" },
  label: { fontWeight:'600', marginBottom:10 },
  title: { fontSize:18, fontWeight:'bold', marginBottom:10 },
  subtitle: { fontWeight:'600', marginTop:10 },
  fightRow: { flexDirection:'row', justifyContent:'space-around', width:'100%', marginVertical:20 },
  bird: { width:80, height:80 },
  error: { color:'red' }
});