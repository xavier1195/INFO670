import React, { useState, useEffect } from "react";
import { View, Text, Image, Modal, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { getWikipediaImage } from "../database/getWikapediaImage";
import { getScientificName } from "../database/getScientificName";


export default function BirdListItem({ bird }) {
  const [imageURL, setImageUrl] = useState(null);
  const [loadingImage, setLoading] = useState(true);
  const [scientificName, setScientificName] = useState(null);
  const [loadingScientificName, setLoadingScientificName] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      const result = await getWikipediaImage(bird.name);
      setImageUrl(result);
      setLoading(false);
    };
    const fetchScientificName = async () => {
      const result = await getScientificName(bird.name);
      setScientificName(result);
      setLoadingScientificName(false);
    };
    fetchScientificName();
    fetchImage();
  }, [bird.name]);

  return (
    <View style={styles.birdContainer}>
      <View style={styles.row}>
        {loadingImage ? (
          <ActivityIndicator size="small" />
        ) : imageURL ? (
          <>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Image source={{ uri: imageURL }} style={styles.image} />
            </TouchableOpacity>
            <Modal visible={modalVisible} transparent={true}>
  <View style={styles.modalContainer}>
    <TouchableOpacity style={styles.backButton} onPress={() => setModalVisible(false)}>
      <Text style={styles.backButtonText}>← Back</Text>
    </TouchableOpacity>

    <Image
      source={{ uri: imageURL }}
      style={styles.fullscreenImage}
      resizeMode="contain"
    />
  </View>
</Modal>

          </>
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Text style={styles.placeholderText}>No image</Text>
          </View>
        )}

        <View style={styles.textContainer}>
          <Text style={styles.commonName}>{bird.name}</Text>
          {loadingScientificName ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text style={styles.latinName}>{scientificName || "Latin name not found"}</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  birdContainer: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  commonName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  latinName: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#555",
  },
  textContainer: {
    marginLeft: 15,
    flexShrink: 1,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 12,
    color: "#666",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseArea: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  fullscreenImage: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 2,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },

  backButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});