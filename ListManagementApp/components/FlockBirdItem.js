import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import globalStyles from "../styles";


export default function FlockBirdItem({ bird }) {
  return (
    <View style={globalStyles.card}>
      <Image
        source={bird.image ? { uri: bird.image } : null}
        style={globalStyles.image}
      />
      <View style={{ flex: 1 }}>
        <Text style={globalStyles.username}>{bird.username}</Text>
        <Text style={globalStyles.name}>{bird.name}</Text>
        <Text style={globalStyles.latin}>{bird.sciName}</Text>
        <Text style={globalStyles.timestamp}>{bird.timestamp?.toDate().toLocaleString() || "Date unknown"}</Text>

      </View>
    </View>
  );
};
