import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebirdConfig.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BIRD_COLLECTION = "birdList";

export const addBirdToCloud = async (bird) => {
    try {
      const userId = await AsyncStorage.getItem("currentUserId");
      if (!userId) throw new Error("User not logged in");

      const userBirdsRef = collection(db, "users", userId, "birdList");
      await addDoc(userBirdsRef, bird);

      console.log("Bird added for user:", userId);
    } catch (error) {
      console.error("Error adding bird to cloud:", error);
    }
  };


  export const getBirdsFromCloud = async () => {
    try {
      const userId = await AsyncStorage.getItem("currentUserId");
      if (!userId) throw new Error("User not logged in");

      const userBirdsRef = collection(db, "users", userId, "birdList");
      const querySnapshot = await getDocs(userBirdsRef);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching user bird list:", error);
      return [];
    }
  };