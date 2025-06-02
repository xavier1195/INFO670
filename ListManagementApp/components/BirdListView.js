import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import BirdListItem from "./BirdListItem.js";
import globalStyles from "../styles";

export default function BirdListView({ title, birds, emptyMessage, showTimestamp = true }) {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>{title}</Text>
      {birds.length === 0 ? (
        <Text style={globalStyles.emptyList}>{emptyMessage}</Text>
      ) : (
        <FlatList
          data={birds}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <BirdListItem bird={item} showTimestamp={showTimestamp} />}
        />
      )}
    </View>
  );
}

