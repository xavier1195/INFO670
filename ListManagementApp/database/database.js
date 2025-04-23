import AsyncStorage from "@react-native-async-storage/async-storage";

const LOCAL_DATABASE_KEY = "@local_birds_list";

export const saveLocalList = async (items) => {
  try {
    const json = JSON.stringify(items);
    await AsyncStorage.setItem(LOCAL_DATABASE_KEY, json);
  } catch (error) {
    console.error("Error saving items to storage", error);
  }
};

export const loadLocalItems = async () => {
  try {
    const json = await AsyncStorage.getItem(LOCAL_DATABASE_KEY);
    return json != null ? JSON.parse(json) : [];
  } catch (error) {
    console.error("Error loading items from storage", error);
    return [];
  }
};

export const clearLocalItems = async () => {
  try {
    await AsyncStorage.removeItem(LOCAL_DATABASE_KEY);
  } catch (error) {
    console.error("Error clearing items from storage", error);
  }
};

export const removeLastLocalItem = async (items) => {
  try {
    const updatedItems = items.slice(0, -1);
    await saveItem(updatedItems);
    return updatedItems;
  } catch (error) {
    console.error("Error removing last item", error);
    return items;
  }
};
