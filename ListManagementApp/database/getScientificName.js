const EBIRD_API_URL = "https://api.ebird.org/v2/ref/taxonomy/ebird";
const EBIRD_API_KEY = "q174or35ri25";

export const getScientificName = async (commonName) => {
    try {
        const response = await fetch(`${EBIRD_API_URL}?fmt=json&locale=en`, {
            headers: {
                "x-ebirdapitoken": EBIRD_API_KEY,
            },
        });

        const data = await response.json();

        const match = data.find(
            (bird) => bird.comName.toLowerCase().trim() === commonName.toLowerCase().trim()
        );

        return match ? match.sciName : null;
    } catch (error) {
        console.error("Error fetching scientific name:", error);
        return null;
    }
};