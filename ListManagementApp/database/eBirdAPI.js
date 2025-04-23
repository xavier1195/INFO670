const EBIRD_API_URL = "https://api.ebird.org/v2/ref/taxonomy/ebird";
const EBIRD_API_KEY = "q174or35ri25";

export const getBirdSuggestions = async () => {
    try {
        const response = await fetch(`${EBIRD_API_URL}?fmt=json&locale=en`, {
            headers: {
                "x-ebirdapitoken": EBIRD_API_KEY,
            },
        });
        const data = await response.json();

        //Possibly filter for US region only birds to speed up APP
        const usBirds = Array.from(
            new Set(data.map((bird) => bird.comName))
        ).sort();

        return usBirds;
    }
    catch (error) {
        console.error("Error fetching bird suggestions:", error);
        return [];
    }
};