export const getWikipediaImage = async (commonName) => {
    try {
      if (!commonName) return null;

      //reformatted to use the case sensitivity of the common name for wikapedia
      const formattedName = commonName
        .trim()
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("_");

      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${formattedName}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.thumbnail && data.thumbnail.source) {
        return data.thumbnail.source;
      } else {
        console.warn(`No image found on Wikipedia for: ${commonName}`);
        return null;
      }
    } catch (error) {
      console.error("Wikipedia image fetch failed:", error);
      return null;
    }
  };
