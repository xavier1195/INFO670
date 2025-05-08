import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import Checkbox from 'expo-checkbox';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../firebirdConfig";
import { collection, doc, getDoc, query, where, getDocs } from "firebase/firestore";
import { createUser, loginUser, logoutUser } from "../database/userDatabase";
import { getWikipediaImage } from "../database/getWikapediaImage";
import { getScientificName } from "../database/getScientificName";
import { AVAIABLE_FLOCKS } from "../components/constants/flocks";

export default function ProfileScreen() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // for signup
  const [password, setPassword] = useState("");
  const [favoriteBird, setFavoriteBird] = useState("");
  const [selectedFlocks, setSelectedFlocks] = useState([]);


  const [birdImage, setBirdImage] = useState(null);
  const [latinName, setLatinName] = useState(null);
  const [loadingBirdInfo, setLoadingBirdInfo] = useState(false);


  const toggleFlock = (flock) => {
    setSelectedFlocks((prev) =>
      prev.includes(flock)
        ? prev.filter((f) => f !== flock)
        : [...prev, flock]
    );
  };

  useEffect(() => {
    const checkUser = async () => {
      const userId = await AsyncStorage.getItem("currentUserId");
      if (userId) {

        const docRef = doc(db, "users", userId);
        const userSnap = await getDoc(docRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setLoggedInUser({ id: userSnap.id, ...userData });

          if (userData.favoriteBird) {
            setLoadingBirdInfo(true);
            const image = await getWikipediaImage(userData.favoriteBird);
            const sci = await getScientificName(userData.favoriteBird);
            setBirdImage(image);
            setLatinName(sci);
            setLoadingBirdInfo(false);
          }
        }
      }
    };

    checkUser();
  }, []);

  const handleCreate = async () => {
    if (!username || !email || !password || !favoriteBird) {
      Alert.alert("All fields are required.");
      return;
    }

    try {
      const id = await createUser({
        username,
        email,
        password,
        favoriteBird,
        flocks: selectedFlocks,
      });

      Alert.alert("Profile created!");
      setLoggedInUser({ id, username, email, favoriteBird, flocks: selectedFlocks });
      setUsername("");
      setEmail("");
      setPassword("");
      setFavoriteBird("");
      setSelectedFlocks([]);

      const image = await getWikipediaImage(favoriteBird);
      const sci = await getScientificName(favoriteBird);
      setBirdImage(image);
      setLatinName(sci);
    } catch (error) {
      Alert.alert(error.message);
    }
  };


  const handleLogin = async () => {
    if (!username) {
      Alert.alert("Enter your username to login.");
      return;
    }

    try {
      const id = await loginUser(username);
      const userDoc = doc(db, "users", id);
      const userSnap = await getDoc(userDoc);
      const userData = userSnap.data();
      setLoggedInUser({ id, ...userData });

      const image = await getWikipediaImage(userData.favoriteBird);
      const sci = await getScientificName(userData.favoriteBird);
      setBirdImage(image);
      setLatinName(sci);
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setLoggedInUser(null);
    setBirdImage(null);
    setLatinName(null);
  };

  if (loggedInUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>My Profile</Text>
        <Text style={styles.label}>Username: <Text style={styles.value}>{loggedInUser.username}</Text></Text>
        <Text style={styles.label}>Email: <Text style={styles.value}>{loggedInUser.email}</Text></Text>
        <Text style={styles.label}>Favorite Bird: <Text style={styles.value}>{loggedInUser.favoriteBird}</Text></Text>

        {loadingBirdInfo ? (
          <ActivityIndicator />
        ) : birdImage ? (
          <Image source={{ uri: birdImage }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholder]} />
        )}
        {latinName && (
          <Text style={styles.latinName}>{latinName}</Text>
        )}

        <Text style={styles.label}>Flocks:</Text>
        {loggedInUser.flocks && loggedInUser.flocks.length > 0 ? (
          loggedInUser.flocks.map((flock) => (
            <Text key={flock} style={styles.flockItem}>• {flock}</Text>
          ))
        ) : (
          <Text>No flocks selected.</Text>
        )}

        <Button title="Logout" onPress={handleLogout} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create or Log In</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email (for signup)"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Favorite Bird"
        value={favoriteBird}
        onChangeText={setFavoriteBird}
      />

      <Text style={styles.subTitle}>Choose Your Flocks</Text>
      {AVAIABLE_FLOCKS.map((flock) => (
        <View key={flock} style={styles.checkboxContainer}>
          <Checkbox
            value={selectedFlocks.includes(flock)}
            onValueChange={() => toggleFlock(flock)}
          />
          <Text style={styles.checkboxLabel}>{flock}</Text>
        </View>
      ))}

      <Button title="Create Profile" onPress={handleCreate} />
      <View style={{ height: 20 }} />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 30 },
  subTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkboxLabel: {
    marginLeft: 8,
  },
  label: { fontSize: 18, marginBottom: 4 },
  value: { fontWeight: "bold" },
  flockItem: {
    fontSize: 16,
    marginLeft: 10,
    color: "#444",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginVertical: 10,
    backgroundColor: "#eee",
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  latinName: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#555",
    marginBottom: 20,
  },
});
