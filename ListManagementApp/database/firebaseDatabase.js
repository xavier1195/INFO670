import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebirdConfig.js";

const BIRD_COLLECTION = "birdList";

export const addBirdToCloud = async (bird) => {
    try {
        await addDoc(collection(db, BIRD_COLLECTION), bird);
        console.log("Bird added to cloud:", bird);
    } catch (error) {
        console.error("Error adding bird to cloud:", error);
    }
};

export const getBirdsFromCloud = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, BIRD_COLLECTION));
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Error getting birds from cloud:", error);
        return [];
    }
};