import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../firebirdConfig";

//does user name exist?
export const findUserByUsername = async (username) => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  return null;
};

//create username
export const createUser = async (userData) => {
  const existing = await findUserByUsername(userData.username);
  if (existing) {
    throw new Error("Username already exists");
  }

  const userRef = await addDoc(collection(db, "users"), {
    ...userData,
    createdAt: new Date().toISOString(),
  });

  await AsyncStorage.setItem("currentUserId", userRef.id);
  await AsyncStorage.setItem("currentUsername", userData.username);
  return userRef.id;
};

//login user
export const loginUser = async (username) => {
  const user = await findUserByUsername(username);
  if (!user) {
    throw new Error("Username not found");
  }

  await AsyncStorage.setItem("currentUserId", user.id);
  await AsyncStorage.setItem("currentUsername", user.username);
  return user.id;
};

//logout
export const logoutUser = async () => {
  await AsyncStorage.removeItem("currentUserId");
};
