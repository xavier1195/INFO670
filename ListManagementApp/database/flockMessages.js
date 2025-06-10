import { collection, addDoc, query, orderBy, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../firebirdConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Add messages
export const addFlockMessage = async (flock, messageText) => {
  const userId = await AsyncStorage.getItem("currentUserId");
  if (!userId) throw new Error("User not logged in");

  const username = await AsyncStorage.getItem("currentUsername");
  if (!username) throw new Error("Username not found");

  const flockRef = collection(db, "flocks", flock, "messages");

  await addDoc(flockRef, {
    message: messageText,
    userId,
    username,
    timestamp: serverTimestamp(),
  });
};


export const getFlockMessages = async (flock) => {
  const flockRef = collection(db, "flocks", flock, "messages");
  const q = query(flockRef, orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

//REPLIES
export const addReplyToMessage = async (flock, messageId, replyText) => {
  const userId = await AsyncStorage.getItem("currentUserId");
  const username = await AsyncStorage.getItem("currentUsername");

  if (!userId || !username) throw new Error("User not logged in");

  const repliesRef = collection(db, "flocks", flock, "messages", messageId, "replies");

  await addDoc(repliesRef, {
    reply: replyText,
    userId,
    username,
    timestamp: serverTimestamp(),
  });
};

export const getRepliesForMessage = async (flock, messageId) => {
  const repliesRef = collection(db, "flocks", flock, "messages", messageId, "replies");
  const q = query(repliesRef, orderBy("timestamp", "asc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};


