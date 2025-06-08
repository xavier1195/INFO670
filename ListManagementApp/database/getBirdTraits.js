// database/getBirdTraits.js
import axios from "axios";

const API_BASE_URL = "http://node.cci.drexel.edu:9651";

export const fetchTraitsByCommonName = async (commonName) => {
  try {
    const resp = await axios.get(`${API_BASE_URL}/api/traits?common_name=${encodeURIComponent(commonName)}`);
    return resp.data;
  } catch (err) {
    console.warn("Failed to fetch traits:", err);
    return null;
  }
};
