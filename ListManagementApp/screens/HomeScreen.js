import React, { useState} from "react";
import { View, Text, StyleSheet, Button, FlatList, TextInput } from "react-native";
import { saveItem, loadItems, clearItems, removeLastItem } from "../database"; // Import your database functions


export default function App() {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState("");

  // Load items from storage when the app starts
  React.useEffect(() => {
    const fetchData = async () => {
      const storedItems = await loadItems();
      setItems(storedItems);
    };
    fetchData();
  }, []);

  const addItem = async () => {
    if (inputValue.trim()) {
      const newItem = { id: Date.now().toString(), name: inputValue };
      const updatedItems = [...items, newItem];
      setItems(updatedItems);
      setInputValue("");
      await saveItem(updatedItems); // Save updated items to storage
    }
  };

  const clearList = async () => {
    await clearItems(); // Clear items from storage
    setItems([]);
  };

  const removeLastItem = async () => {
    const updatedItems = items.slice(0, -1);
    setItems(updatedItems);
    await saveItem(updatedItems); // Save updated items to storage
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Birds I've Seen Today</Text>
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
      <Button style={styles.buttons} title="Clear List" onPress={clearItems} />
      <Button style={styles.buttons} title="Remove Last Item" onPress={removeLastItem} />

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
  buttons: {
      marginBottom: 100,
      fontSize: 55,
      backgroundColor: "#888888",
      color: "#fff",
    },
});
//base code for list management app - easily add text box and make it a specific thing and bada bing bada boom