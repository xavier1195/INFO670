// components/BirdListItem.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { getWikipediaImage } from "../database/getWikapediaImage";
import { getScientificName } from "../database/getScientificName";
import globalStyles from "../styles";

/**
 * Props:
 *   bird: {
 *     id: string,
 *     name: string,
 *     timestamp: FirestoreTimestamp or JS Date,
 *     date: string  // or whatever your bird object has for dateSeen
 *     ...anyotherfields
 *   }
 *   showTimestamp: boolean  (default true)
 *   onPress: function(birdWithDetails) → void
 */
export default function BirdListItem({
  bird,
  showTimestamp = true,
  onPress,          // new
}) {
  const [imageURL, setImageUrl] = useState(null);
  const [loadingImage, setLoading] = useState(true);
  const [scientificName, setScientificName] = useState(null);
  const [loadingScientificName, setLoadingScientificName] = useState(true);

  // Once image + sciName are both loaded, this function packages up details:
  const handleTap = () => {
    // We only fire onPress if imageURL (or null) and sciName (or null) have finished loading.
    if (!loadingImage && !loadingScientificName && onPress) {
      onPress({
        id: bird.id,
        commonName: bird.name,
        dateSeen: bird.timestamp
          ? bird.timestamp.toDate().toLocaleString()
          : bird.date || null,
        imageURL,           // may be null if not found
        sciName: scientificName, // may be null if not found
      });
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const result = await getWikipediaImage(bird.name);
        setImageUrl(result);
      } catch (e) {
        console.warn("Error fetching Wikipedia image:", e);
      } finally {
        setLoading(false);
      }
    };
    const fetchScientificName = async () => {
      try {
        const result = await getScientificName(bird.name);
        setScientificName(result);
      } catch (e) {
        console.warn("Error fetching scientific name:", e);
      } finally {
        setLoadingScientificName(false);
      }
    };
    fetchScientificName();
    fetchImage();
  }, [bird.name]);

  return (
    <TouchableOpacity onPress={handleTap} activeOpacity={0.7}>
      <View style={globalStyles.birdContainer}>
        <View style={globalStyles.row}>
          {loadingImage ? (
            <ActivityIndicator size="small" />
          ) : imageURL ? (
            <Image source={{ uri: imageURL }} style={globalStyles.image} />
          ) : (
            <View style={[globalStyles.image, globalStyles.placeholder]}>
              <Text style={globalStyles.placeholderText}>No image</Text>
            </View>
          )}

          <View style={globalStyles.textContainer}>
            <Text style={globalStyles.commonName}>{bird.name}</Text>

            {loadingScientificName ? (
              <ActivityIndicator size="small" />
            ) : (
              <Text style={globalStyles.latinName}>
                {scientificName || "Latin name not found"}
              </Text>
            )}

            {showTimestamp && (
              <Text style={globalStyles.timestamp}>
                {bird.timestamp
                  ? bird.timestamp.toDate().toLocaleString()
                  : bird.date || "Date unknown"}
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
