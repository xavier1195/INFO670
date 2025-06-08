import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { getBirdsFromCloud } from "../database/firebaseDatabase";
import { fetchTraitsByCommonName } from "../database/getBirdTraits";

const DURATION = 10;       // seconds
const SCALE    = 0.5;      // pixels per meter (was 10 pixels per km)
const DIVISOR  = 10;     // divide km→m so distances stay reasonable

export default function BirdRace({ onFinish }) {
  const [loading, setLoading] = useState(true);
  const [bird1,   setBird1]   = useState(null);
  const [bird2,   setBird2]   = useState(null);
  const [d1,      setDistance1] = useState(0);
  const [d2,      setDistance2] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);

  const dist1Ref = useRef(0);
  const dist2Ref = useRef(0);

  // 1) pick two birds and compute their speeds
  useEffect(() => {
    (async () => {
      try {
        const birds = await getBirdsFromCloud();
        if (!birds || birds.length < 2) {
          return onFinish?.({ error: "Need at least two birds." });
        }
        const [b1, b2] = birds.sort(() => 0.5 - Math.random()).slice(0, 2);

        const raw1 = await fetchTraitsByCommonName(b1.name);
        const raw2 = await fetchTraitsByCommonName(b2.name);


        const w1 = raw1.Wing_Length ?? 0;
        const m1 = raw1.Mass        ?? 0;
        const w2 = raw2.Wing_Length ?? 0;
        const m2 = raw2.Mass        ?? 0;


        const calcSpeed = (wing, mass) => {
          let base;
          if (mass > wing) {
            base = 1 + (mass * 0.5) - (wing * 0.5);
          } else {
            base = 1 + (wing * 0.5) - (mass * 0.5);
          }

          return base / DIVISOR;
        };

        setBird1({ name: b1.name, speed: calcSpeed(w1, m1) });
        setBird2({ name: b2.name, speed: calcSpeed(w2, m2) });
        setLoading(false);
      } catch (e) {
        console.warn("Failed to start race:", e);
        onFinish?.({ error: "Failed to start race." });
      }
    })();
  }, []);

  // 2) simulate
  useEffect(() => {
    if (loading || !bird1 || !bird2) return;

    let ticks = 0;
    const iv = setInterval(() => {
      ticks += 1;
      dist1Ref.current += bird1.speed;
      dist2Ref.current += bird2.speed;
      setDistance1(dist1Ref.current);
      setDistance2(dist2Ref.current);
      setTimeLeft(DURATION - ticks);

      if (ticks >= DURATION) {
        clearInterval(iv);
        const result = dist1Ref.current === dist2Ref.current
          ? { tie: true, dist1: d1, dist2: d2 }
          : dist1Ref.current > dist2Ref.current
            ? { winner: bird1, dist1: d1, dist2: d2 }
            : { winner: bird2, dist1: d1, dist2: d2 };
        onFinish?.(result);
      }
    }, 1000);

    return () => clearInterval(iv);
  }, [loading, bird1, bird2]);

  // 3) render
  if (loading || !bird1 || !bird2) {
    return <Text>Loading race...</Text>;
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={styles.timer}>Time left: {timeLeft}s</Text>
      <View style={styles.row}>
        <Text style={styles.label}>{bird1.name}</Text>
        <View style={[styles.block, { width: d1 * SCALE }]} />
        <Text style={styles.km}>{(d1 * 1).toFixed(2)} m</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>{bird2.name}</Text>
        <View
          style={[
            styles.block,
            { width: d2 * SCALE, backgroundColor: "#ff9800" },
          ]}
        />
        <Text style={styles.km}>{(d2 * 1).toFixed(2)} m</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row:   { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  label: { width:  80 },
  block: { height: 20, backgroundColor: "#4B0082", marginHorizontal: 4 },
  km:    { marginLeft: 8 },
  timer: { marginBottom: 10, fontWeight: "bold" },
});
