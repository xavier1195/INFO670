import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Image,
  Text,
  ScrollView,
  Platform,
} from "react-native";
import { Modal, Portal, Card, Paragraph, Button } from "react-native-paper";
import axios from "axios";
import globalStyles from "../styles";

const API_BASE_URL = "http://node.cci.drexel.edu:9651";

export default function BirdDetailModal({ visible, bird, onClose }) {
  const [traits, setTraits] = useState(null);
  const [loadingTraits, setLoadingTraits] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!bird?.commonName) {
      setTraits(null);
      return;
    }
    setLoadingTraits(true);
    setError("");


const url = `${API_BASE_URL}/api/traits?common_name=${encodeURIComponent(bird.commonName)}`;
console.log("Fetching traits from:", url);
    axios
      .get(url)
      .then((res) => {
        setTraits(res.data);
      })
      .catch((err) => {
        console.warn("Failed to fetch traits:", err);
        setError("Trait data not available");
      })
      .finally(() => setLoadingTraits(false));
  }, [bird?.commonName]);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={styles.modalWrapper}
      >
        <Card>
          {/* Title uses bird.commonName */}
          <Card.Title
            title={bird?.commonName || ""}
            subtitle={bird?.dateSeen || ""}
          />
          <Card.Content>
            {bird?.imageURL ? (
              <Image
                source={{ uri: bird.imageURL }}
                style={globalStyles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={[globalStyles.image, globalStyles.placeholder]}>
                <Text style={globalStyles.placeholderText}>No image</Text>
              </View>
            )}

            {bird?.sciName ? (
              <Paragraph style={styles.latinLine}>
                <Text style={styles.boldLabel}>Latin:</Text>{" "}
                <Text style={globalStyles.latin}>{bird.sciName}</Text>
              </Paragraph>
            ) : null}

            <View style={styles.divider} />

            {loadingTraits ? (
              <ActivityIndicator size="large" style={{ marginVertical: 16 }} />
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : traits ? (
              <ScrollView>
                <Paragraph>
                  <Text style={styles.boldLabel}>Beak (culmen):</Text>{" "}
                  {traits.Beak_Length_Culmen ?? "—"}
                </Paragraph>
                <Paragraph>
                  <Text style={styles.boldLabel}>Beak width:</Text>{" "}
                  {traits.Beak_Width ?? "—"}
                </Paragraph>
                <Paragraph>
                  <Text style={styles.boldLabel}>Wing length:</Text>{" "}
                  {traits.Wing_Length ?? "—"}
                </Paragraph>
                <Paragraph>
                  <Text style={styles.boldLabel}>Tail length:</Text>{" "}
                  {traits.Tail_Length ?? "—"}
                </Paragraph>
                <Paragraph>
                  <Text style={styles.boldLabel}>Mass:</Text> {traits.Mass ?? "—"}
                </Paragraph>
                <Paragraph>
                  <Text style={styles.boldLabel}>Trophic level:</Text>{" "}
                  {traits.Trophic_Level ?? "—"}
                </Paragraph>
                <Paragraph>
                  <Text style={styles.boldLabel}>Trophic niche:</Text>{" "}
                  {traits.Trophic_Niche ?? "—"}
                </Paragraph>
                <Paragraph>
                  <Text style={styles.boldLabel}>Habitat:</Text>{" "}
                  {traits.Habitat ?? "—"}
                </Paragraph>
              </ScrollView>
            ) : (
              <Paragraph>No traits found.</Paragraph>
            )}
          </Card.Content>

          <Card.Actions>
            <Button onPress={onClose}>Close</Button>
          </Card.Actions>
        </Card>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalWrapper: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 0,
  },
  divider: {
    height: 1,
    backgroundColor: "#DDD",
    marginVertical: 12,
  },
  boldLabel: {
    fontWeight: "600",
  },
  latinLine: {
    marginBottom: 8,
  },
  errorText: {
    color: "red",
  },
});
