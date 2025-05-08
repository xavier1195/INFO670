import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { getFlockBirds } from "../database/getFlockBirds";
import FlockBirdItem from "../components/FlockBirdItem";

export default function FlocksScreen() {
  const [birds, setBirds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBirds = async () => {
      try {
        const data = await getFlockBirds();
        setBirds(data);
      } catch (error) {
        console.error("Error loading flock birds:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBirds();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Birds from Your Flocks</Text>
      {birds.length === 0 ? (
        <Text style={styles.empty}>No birds found from your flocks.</Text>
      ) : (
        <FlatList
          data={birds}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <FlockBirdItem bird={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  empty: {
    fontSize: 16,
    marginTop: 20,
    color: "#777",
  },
});
