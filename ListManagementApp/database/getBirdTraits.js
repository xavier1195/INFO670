// database/getBirdTraits.js
import axios from "axios";
import { Platform } from "react-native";

const API_BASE = Platform.select({
  ios:     "http://localhost:3000",
  android: "http://10.0.2.2:3000",
  default: "http://192.168.1.42:3000",
});

export const fetchTraitsByCommonName = async (commonName) => {
  try {
    const resp = await axios.get(`${API_BASE}/traits?common_name=${encodeURIComponent(commonName)}`);
    return resp.data;
  } catch (err) {
    console.warn("Failed to fetch traits:", err);
    return null;
  }
};
