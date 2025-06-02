import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, TextInput } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import BirdListView from "../components/BirdListView";
import {
  saveLocalList,
  loadLocalItems,
  clearLocalItems,
  removeLastLocalItem,
} from "../database/database";
import { addBirdToCloud } from "../database/firebaseDatabase";
import AutoCompleteInput from "../components/autoCompleteInput";
import globalStyles from "../styles";


export default function HomeScreen() {
  const [birdList, setBirdList] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      const getBirdList = async () => {
        const storedLocal = await loadLocalItems();
        setBirdList(storedLocal);
      };
      getBirdList();
    }, [])
  );

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
      <View style={globalStyles.inputContainer}>
      <AutoCompleteInput inputStyle={globalStyles.input} onBirdSelect={setInputValue} />

        <Button title="Add Bird" onPress={addBird} />
        <Button title="Clear Today's Birds" onPress={clearLocalBirds} />
        <Button title="Remove Last Bird" onPress={handleRemoveLastBird} />
      </View>
      <BirdListView
        title="Birds I've Seen Today"
        birds={birdList}
        emptyMessage="No birds seen today."
        showTimestamp={false}
      />
    </View>
  );
}