import React, { useState, useCallback } from "react";
import { View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getBirdsFromCloud } from "../database/firebaseDatabase";
import BirdListView from "../components/BirdListView";

export default function DatabaseScreen() {
  const [birdsLog, setBirdsLog] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const getData = async () => {
        const data = await getBirdsFromCloud();
        setBirdsLog(data);
      };
      getData();
    }, [])
  );

  return (
    <View style={{ flex: 1 }}>
      <BirdListView
        title="Birds Log"
        birds={birdsLog}
        emptyMessage="No birds logged yet."
      />
    </View>
  );
}
