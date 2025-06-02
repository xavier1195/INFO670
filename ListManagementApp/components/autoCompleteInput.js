import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { getBirdSuggestions } from "../database/eBirdAPI";
import globalStyles from "../styles";


export default function autoCompleteInput({ onBirdSelect }) {
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState("");
  const [allBirds, setAllBirds] = useState([]);

  useEffect(() => {
    const loadSuggestions = async () => {
      const birdNames = await getBirdSuggestions(query);
      setAllBirds(birdNames);
    };
    loadSuggestions();
  }, []);

  const handleInputChange = (text) => {
    setQuery(text);
    if (text.length === 0) {
      setSuggestions([]);
    } else {
      const filteredSuggestions = allBirds.filter((bird) =>
        bird.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(filteredSuggestions.slice(0, 10));
    }
  };

  const handleSelect = (bird) => {
    setQuery(bird);
    setSuggestions([]);
    onBirdSelect(bird);
  };

  return (
    <View style={globalStyles.container}>
      <TextInput
        style={globalStyles.input}
        placeholder="Search for a bird..."
        value={query}
        onChangeText={handleInputChange}
      />
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelect(item)}>
              <Text style={globalStyles.suggestion}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}


