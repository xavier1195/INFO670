// screens/DatabaseScreen.js
import React, { useState, useCallback } from "react";
import { View, FlatList, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getBirdsFromCloud } from "../database/firebaseDatabase";
import BirdListItem from "../components/BirdListItem";
import BirdDetailModal from "../components/BirdDetailModal";
import globalStyles from "../styles";

export default function DatabaseScreen() {
  const [birdsLog, setBirdsLog] = useState([]);
  const [selectedBird, setSelectedBird] = useState(null);

  // Re-fetch Firestore data each time we navigate here:
  useFocusEffect(
    useCallback(() => {
      (async () => {
        const data = await getBirdsFromCloud();
        setBirdsLog(data);
      })();
    }, [])
  );

  // When a BirdListItem is tapped, it will call this with the complete details:
  const handlePressRow = (birdWithDetails) => {
    setSelectedBird(birdWithDetails);
  };

  // Close the detail modal
  const closeModal = () => {
    setSelectedBird(null);
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={birdsLog}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BirdListItem
            bird={item}
            showTimestamp={true}
            onPress={handlePressRow}
          />
        )}
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={globalStyles.emptyList}>No birds logged yet.</Text>
          </View>
        )}
      />

      {/* BirdDetailModal pops open once selectedBird is non-null */}
      <BirdDetailModal
        visible={!!selectedBird}
        bird={selectedBird}
        onClose={closeModal}
      />
    </View>
  );
}
