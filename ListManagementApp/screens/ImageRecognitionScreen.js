// screens/ImageRecognitionScreen.js

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import axios from "axios";
import globalStyles from "../styles";

export default function ImageRecognitionScreen() {
  const [photoUri, setPhotoUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [prediction, setPrediction] = useState(null); // { bird: string, confidence: number }
  const [error, setError] = useState("");

  // Change this if your backend is on a different host/port:
  const API_BASE_URL = "http://node.cci.drexel.edu:9651";

  // 1) Let user pick an image from their library
  const selectImage = () => {
    setError("");
    setPrediction(null);

    launchImageLibrary(
      {
        mediaType: "photo",
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) {
          // User cancelled
          return;
        } else if (response.errorCode) {
          Alert.alert("Image Picker Error", response.errorMessage || "Unknown error");
        } else if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          setPhotoUri(asset.uri);
        }
      }
    );
  };

  // 2) Upload the selected image to /api/predict
  const uploadImageForPrediction = async () => {
    if (!photoUri) {
      Alert.alert("No image selected", "Please pick a photo first.");
      return;
    }

    setUploading(true);
    setPrediction(null);
    setError("");

    try {
      // Prepare a FormData object with the image file
      const formData = new FormData();
      // On iOS the URI might be "file://...", on Android "content://..."
      // We need to extract filename and mime type:
      const uriParts = photoUri.split("/");
      const fileName = uriParts[uriParts.length - 1];
      let fileType = "image/jpeg";
      if (fileName.toLowerCase().endsWith(".png")) fileType = "image/png";

      formData.append("photo", {
        uri: photoUri,
        name: fileName,
        type: fileType,
      });

      // Make POST request
      const url = `${API_BASE_URL}/api/predict`;
      const res = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Expecting { bird: string, confidence: number } from the backend
      setPrediction(res.data);
    } catch (err) {
      console.warn("Upload / prediction error:", err.message || err);
      setError("Failed to get prediction. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Bird Image Recognition</Text>

      <View style={styles.buttonContainer}>
        <Button title="Pick Photo" onPress={selectImage} color="#4B0082" />
      </View>

      {photoUri && (
        <View style={styles.previewContainer}>
          <Text style={styles.label}>Selected Image:</Text>
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
        </View>
      )}

      {photoUri && !uploading && (
        <View style={styles.buttonContainer}>
          <Button
            title="Upload & Identify"
            onPress={uploadImageForPrediction}
            color="#4B0082"
          />
        </View>
      )}

      {uploading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4B0082" />
          <Text style={styles.loadingText}>Analyzing...</Text>
        </View>
      )}

      {prediction && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            Prediction:{" "}
            <Text style={styles.boldText}>{prediction.bird}</Text>
          </Text>
          <Text style={styles.resultText}>
            Confidence:{" "}
            <Text style={styles.boldText}>
              {(prediction.confidence * 100).toFixed(1)}%
            </Text>
          </Text>
        </View>
      )}

      {!!error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyles.background || "#f5f5f5",
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
    color: "#4B0082",
  },
  buttonContainer: {
    marginVertical: 8,
  },
  previewContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: globalStyles.text || "#333",
  },
  previewImage: {
    width: 250,
    height: 250,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  loadingContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: globalStyles.text || "#333",
  },
  resultContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
  },
  resultText: {
    fontSize: 18,
    marginBottom: 8,
    color: globalStyles.text || "#333",
  },
  boldText: {
    fontWeight: "bold",
    color: "#4B0082",
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: "#ff3b30",
    textAlign: "center",
  },
});
