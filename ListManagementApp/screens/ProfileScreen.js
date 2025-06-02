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
import globalStyles from "../styles";

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
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>My Profile</Text>
        <Text style={globalStyles.label}>Username: <Text style={globalStyles.value}>{loggedInUser.username}</Text></Text>
        <Text style={globalStyles.label}>Email: <Text style={globalStyles.value}>{loggedInUser.email}</Text></Text>
        <Text style={globalStyles.label}>Favorite Bird: <Text style={globalStyles.value}>{loggedInUser.favoriteBird}</Text></Text>

        {loadingBirdInfo ? (
          <ActivityIndicator />
        ) : birdImage ? (
          <Image source={{ uri: birdImage }} style={globalStyles.image} />
        ) : (
          <View style={[globalStyles.image, globalStyles.placeholder]} />
        )}
        {latinName && (
          <Text style={globalStyles.latinName}>{latinName}</Text>
        )}

        <Text style={globalStyles.label}>Flocks:</Text>
        {loggedInUser.flocks && loggedInUser.flocks.length > 0 ? (
          loggedInUser.flocks.map((flock) => (
            <Text key={flock} style={globalStyles.flockItem}>• {flock}</Text>
          ))
        ) : (
          <Text>No flocks selected.</Text>
        )}

        <Button title="Logout" onPress={handleLogout} />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Create or Log In</Text>

      <TextInput
        style={globalStyles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={globalStyles.input}
        placeholder="Email (for signup)"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={globalStyles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={globalStyles.input}
        placeholder="Favorite Bird"
        value={favoriteBird}
        onChangeText={setFavoriteBird}
      />

      <Text style={globalStyles.subTitle}>Choose Your Flocks</Text>
      {AVAIABLE_FLOCKS.map((flock) => (
        <View key={flock} style={globalStyles.checkboxContainer}>
          <Checkbox
            value={selectedFlocks.includes(flock)}
            onValueChange={() => toggleFlock(flock)}
          />
          <Text style={globalStyles.checkboxLabel}>{flock}</Text>
        </View>
      ))}

      <Button title="Create Profile" onPress={handleCreate} />
      <View style={{ height: 20 }} />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}


