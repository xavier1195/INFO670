import React, { useState} from "react";
import { View, Text, StyleSheet, Button, FlatList, TextInput } from "react-native";

export default function App() {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const addItem = () => {
    if (inputValue.trim()) {
      const newItem = { id: Date.now().toString(), name: inputValue };
      setItems((prevItems) => [...prevItems, newItem]);
      setInputValue("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>List Management App</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Item Name"
        value={inputValue}
        onChangeText={text => setInputValue(text)}
      />
      <Button title="Add Item" onPress={addItem} />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.item}>{item.name}</Text>}
      />
      <Button style={styles.button} title="Clear List" onPress={() => setItems([])} />
      <Button style={styles.button} title="Remove Last Item" onPress={() => setItems((prevItems) => prevItems.slice(0, -1))} />

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
  button:{
      marginBottom: 100,
      backgroundColor: "#888888",
      color: "#fff",
    },
});
//base code for list management app - easily add text box and make it a specific thing and bada bing bada boom