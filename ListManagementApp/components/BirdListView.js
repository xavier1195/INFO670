import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import BirdListItem from "./BirdListItem.js";

export default function BirdListView({ title, birds, emptyMessage }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {birds.length === 0 ? (
        <Text style={styles.emptyList}>{emptyMessage}</Text>
      ) : (
        <FlatList
          data={birds}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <BirdListItem bird={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  emptyList: {
    fontSize: 18,
    color: "#888",
  },
});