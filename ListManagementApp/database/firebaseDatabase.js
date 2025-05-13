import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../firebirdConfig.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BIRD_COLLECTION = "birdList";

export const addBirdToCloud = async (bird) => {
    try {
      const userId = await AsyncStorage.getItem("currentUserId");
      if (!userId) throw new Error("User not logged in");

      const birdWithMetadata = {
        ...bird,
        userId,
        timestamp: serverTimestamp(),
      };

      // Global list for flocks and search
      await addDoc(collection(db, BIRD_COLLECTION), birdWithMetadata);

      // User-specific subcollection
      await addDoc(collection(db, "users", userId, BIRD_COLLECTION), birdWithMetadata);

      console.log("Bird added to global and user log:", birdWithMetadata);
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

