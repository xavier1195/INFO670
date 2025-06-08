import React, { useState, useEffect } from "react";
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
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import globalStyles from "../styles";

export default function ImageRecognitionScreen() {
  const [photoUri, setPhotoUri] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");

  // NOTE: point this at the *root* of your function
  const FUNCTION_URL =
    "https://us-east1-birdsiveseen-834d2.cloudfunctions.net/predict2";

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission required",
            "This app needs photo library access to pick bird images."
          );
        }
      }
    })();
  }, []);

  const selectImage = async () => {
    setError("");
    setPrediction(null);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: false,
      });

      if (result.canceled) return;

      // Expo 49+: result.assets is an array
      const asset = result.assets?.[0] ?? result;
      const uri = asset.uri;
      if (!uri) throw new Error("Could not get URI from picker");

      const name = uri.split("/").pop();
      // infer type from extension
      const extMatch = /\.(\w+)$/.exec(name);
      const ext = extMatch ? extMatch[1].toLowerCase() : "jpg";
      const type = `image/${ext === "jpg" ? "jpeg" : ext}`;

      setPhotoUri(uri);
      setSelectedFile({ uri, name, type });
    } catch (e) {
      Alert.alert("Error opening image picker", e.message);
    }
  };

  const uploadImageForPrediction = async () => {
    if (!selectedFile) {
      Alert.alert("No image selected", "Please pick a photo first.");
      return;
    }

    setUploading(true);
    setPrediction(null);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", {
        uri: selectedFile.uri,
        name: selectedFile.name,
        type: selectedFile.type,
      });

      const res = await axios.post(FUNCTION_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
        timeout: 30000,
      });

      // The function will return { predicted_class, confidence }
      const { predicted_class, confidence } = res.data;
      if (!predicted_class) {
        throw new Error("Invalid response from server");
      }

      setPrediction({ bird: predicted_class, confidence });
    } catch (err) {
      console.warn("Upload / prediction error:", err);
      let msg = "Failed to get prediction. Please try again.";
      if (err.response?.data?.detail) msg = err.response.data.detail;
      else if (err.message) msg = err.message;
      setError(msg);
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

      {!!error && <Text style={styles.errorText}>{error}</Text>}
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
  buttonContainer: { marginVertical: 8 },
  previewContainer: { marginTop: 16, alignItems: "center" },
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
  loadingContainer: { marginTop: 24, alignItems: "center" },
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
  boldText: { fontWeight: "bold", color: "#4B0082" },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: "#ff3b30",
    textAlign: "center",
  },
});
