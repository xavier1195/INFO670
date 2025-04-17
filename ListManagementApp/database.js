import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@list_items";

export const saveItem = async (items) => {
  try {
    const json = JSON.stringify(items);
    await AsyncStorage.setItem(STORAGE_KEY, json);
  } catch (error) {
    console.error("Error saving items to storage", error);
  }
};

export const loadItems = async () => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json != null ? JSON.parse(json) : [];
  } catch (error) {
    console.error("Error loading items from storage", error);
    return [];
  }
};

export const clearItems = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing items from storage", error);
  }
};

export const removeLastItem = async (items) => {
  try {
    const updatedItems = items.slice(0, -1);
    await saveItem(updatedItems);
    return updatedItems;
  } catch (error) {
    console.error("Error removing last item", error);
    return items;
  }
};
