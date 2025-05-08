import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function FlockBirdItem({ bird }) {
  return (
    <View style={styles.card}>
      <Image
        source={bird.image ? { uri: bird.image } : null}
        style={styles.image}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.username}>{bird.username}</Text>
        <Text style={styles.name}>{bird.name}</Text>
        <Text style={styles.latin}>{bird.sciName}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#ccc",
  },
  username: {
    fontSize: 14,
    color: "#666",
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  latin: {
    fontStyle: "italic",
    fontSize: 14,
    color: "#444",
  },
});
