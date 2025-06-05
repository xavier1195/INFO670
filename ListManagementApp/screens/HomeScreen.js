// screens/HomeScreen.js
import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Platform,
  Animated,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
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


import { IconButton, Badge } from "react-native-paper";


export default function HomeScreen() {
  const [birdList, setBirdList] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [hasNewMessages, setHasNewMessages] = useState(false); // toggle this when a message arrives

  const navigation = useNavigation();
  const bounceAnim = useRef(new Animated.Value(1)).current;

  /*** 1) Load local bird list on focus ***/
  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const storedLocal = await loadLocalItems();
        setBirdList(storedLocal);
      })();
    }, [])
  );

  /*** 2) BOUNCE ANIMATION for Flocks icon ***/
  useEffect(() => {
    if (hasNewMessages) {
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.3,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1.0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // If you want it to keep bouncing every few seconds, you can loop here.
        // But for a one‐time bounce on arrival, this is enough.
      });
    }
  }, [hasNewMessages, bounceAnim]);

  /*** 3) Configure headerRight with Profile + Flocks icons ***/
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerIconsContainer}>
          <TouchableOpacity
            onPress={() => {

              navigation.navigate("Flocks");
              setHasNewMessages(false);
            }}
            style={styles.iconTouchable}
            activeOpacity={0.7}
          >
            <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
              <IconButton icon="bird" size={24} color="#4B0082" />
            </Animated.View>
            {hasNewMessages && <Badge style={styles.badge} size={8} />}
          </TouchableOpacity>

          {/* Profile / Person Icon */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Profile");
            }}
            style={[styles.iconTouchable, { marginLeft: 16 }]}
            activeOpacity={0.7}
          >
            <IconButton icon="account" size={24} color="#4B0082" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, hasNewMessages, bounceAnim]);

  /*** 4) Example bird manipulation functions ***/
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
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      {/*** 5) INPUT + BUTTONS at top ***/}
      <View style={globalStyles.inputContainer}>
        <AutoCompleteInput
          inputStyle={globalStyles.input}
          onBirdSelect={setInputValue}
        />
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

const styles = StyleSheet.create({
  headerIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: Platform.OS === "ios" ? 10 : 0, // adjust if needed
  },
  iconTouchable: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FF3B30", // red
    width: 8,
    height: 8,
    borderRadius: 4,
    zIndex: 1,
  },
});
