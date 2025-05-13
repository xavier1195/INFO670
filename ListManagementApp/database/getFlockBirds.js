import { db } from "../firebirdConfig";
import { collection, getDocs } from "firebase/firestore";
import { getWikipediaImage } from "./getWikapediaImage";
import { getScientificName } from "./getScientificName";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getFlockBirds = async () => {
  const currentUserId = await AsyncStorage.getItem("currentUserId");
  if (!currentUserId) throw new Error("User not logged in");

  // Get current user
  const usersSnap = await getDocs(collection(db, "users"));
  const currentUserDoc = usersSnap.docs.find((doc) => doc.id === currentUserId);
  const currentUser = currentUserDoc?.data();

  if (!currentUser || !currentUser.flocks) return [];

  // Find users in the same flocks
  const sameFlockUsers = usersSnap.docs
    .filter((doc) => {
      const data = doc.data();
      return (
        doc.id !== currentUserId &&
        data.flocks?.some((f) => currentUser.flocks.includes(f))
      );
    })
    .map((doc) => ({ id: doc.id, ...doc.data() }));

  // Get birds
  const birdSnap = await getDocs(collection(db, "birdList"));
  const birds = birdSnap.docs
    .map((doc) => doc.data())
    .filter((bird) => sameFlockUsers.some((u) => u.id === bird.userId));

  const enriched = await Promise.all(
    birds.map(async (bird) => {
      const user = sameFlockUsers.find((u) => u.id === bird.userId);
      const image = await getWikipediaImage(bird.name);
      const sci = await getScientificName(bird.name);
      return {
        id: bird.timestamp || bird.id,
        name: bird.name,
        sciName: sci,
        image,
        username: user.username,
      };
    })
  );

  return {
    flock: currentUser.flocks[0] || "Your Flock",
    birds: await Promise.all(
      birds.map(async (bird) => {
        const user = sameFlockUsers.find((u) => u.id === bird.userId);
        const image = await getWikipediaImage(bird.name);
        const sci = await getScientificName(bird.name);
        return {
          id: bird.timestamp?.seconds?.toString() || bird.id,
          name: bird.name,
          sciName: sci,
          image,
          username: user.username,
          timestamp: bird.timestamp,
        };
      })
    ),
  };



};
