import AsyncStorage from '@react-native-async-storage/async-storage';

export default class StorageService {
  static async getLastBird() {
    const json = await AsyncStorage.getItem('@local_birds_list');
    const list = json ? JSON.parse(json) : [];
    return list.length ? list[list.length - 1] : null;
  }
}