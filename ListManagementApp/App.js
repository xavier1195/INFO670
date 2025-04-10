import React, { useState} from "react";
import { View, Text, StyleSheet, Button, FlatList } from "react-native";

export default function App() {
  const [items, setItems] = useState([
    { id: "1", name: "Item 1" },
    { id: "2", name: "Item 2" },
    { id: "3", name: "Item 3" },
  ]);

  const addItem = () => {
    const newItem = { id: Date.now().toString(), name: `Item ${items.length + 1}` };
    setItems((prevItems) => [...prevItems, newItem]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>List Management App</Text>
      <Button title="Add Item" onPress={addItem} />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.item}>{item.name}</Text>}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  item: {
    padding: 10,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
// This code is a simple React Native app that allows users to manage a list of items.
// It uses the useState hook to manage the state of the items and the FlatList component to display them.
// The app has a button to add new items to the list, and each item is displayed with its name.
// The styles are defined using StyleSheet to create a clean and organized layout.