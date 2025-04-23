import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, TextInput } from "react-native";
import BirdListView from "../components/BirdListView";
import {
  saveLocalList,
  loadLocalItems,
  clearLocalItems,
  removeLastLocalItem,
} from "../database/database";
import { addBirdToCloud } from "../database/firebaseDatabase";

export default function HomeScreen() {
  const [birdList, setBirdList] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const getBirdList = async () => {
      const storedLocal = await loadLocalItems();
      setBirdList(storedLocal);
    };
    getBirdList();
  }, []);

  const addBird = async () => {
    if (inputValue.trim()) {
      const newBird = {
        id: Date.now().toString(),
        name: inputValue,
        date: new Date().toISOString(),
      };

      const updatedBirdList = [...birdList, newBird];
      setBirdList(updatedBirdList);
      setInputValue("");

      await saveLocalList(updatedBirdList);
      await addBirdToCloud(newBird);
    }
  };

  const clearLocalBirds = async () => {
    setBirdList([]);
    await clearLocalItems();
  };

  const handleRemoveLastBird = async () => {
    const updatedItems = await removeLastLocalItem(birdList);
    setBirdList(updatedItems);
    await saveLocalList(updatedItems);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter bird name"
          value={inputValue}
          onChangeText={setInputValue}
        />
        <Button title="Add Bird" onPress={addBird} />
        <Button title="Clear Today's Birds" onPress={clearLocalBirds} />
        <Button title="Remove Last Bird" onPress={handleRemoveLastBird} />
      </View>
      <BirdListView
        title="Birds I've Seen Today"
        birds={birdList}
        emptyMessage="No birds seen today."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: { padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});
