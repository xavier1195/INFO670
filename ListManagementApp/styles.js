// styles.js
import { StyleSheet } from "react-native";

export const COLORS = {
  primary: "#4B0082",
  background: "#f5f5f5",
  text: "#333",
  muted: "#888",
  placeholder: "#ccc",
};

export const SPACING = {
  tiny: 4,
  small: 8,
  base: 16,
  large: 24,
  xl: 32,
};

export const FONT_SIZES = {
  small: 12,
  body: 16,
  title: 20,
  header: 24,
};

export default StyleSheet.create({
  // your bird list / modal / image styles
 headerIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: SPACING.base,
  },

  // Input area on Home
  inputContainer: {
    padding: SPACING.base,
    backgroundColor: COLORS.background,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.muted,
    borderRadius: 5,
    padding: SPACING.small,
    marginBottom: SPACING.small,
  },

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

  // this is the “small” image style you used most recently
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginVertical: 10,
    backgroundColor: "#eee",
    padding: 5,
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 12,
    color: "#666",
  },

  // modal / fullscreen
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

  // autocomplete suggestions
  container: {
    padding: 20,
  },
  suggestion: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },

  // avatar
  avatar: {
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#444",
  },

  // card (DatabaseScreen / FlockBirdItem)
  card: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  username: {
    fontSize: 14,
    color: "#666",
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  latin: {
    fontStyle: "italic",
    fontSize: 14,
    color: "#444",
  },
  emptyList: {
    fontSize: 18,
    color: "#888",
  },

  // HomeScreen / general
  inputContainer: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  // FlockScreen messages
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  message: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#5f9ea0",
  },
  messageUser: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  reply: {
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderColor: "#ddd",
    marginTop: 4,
  },
  replyUser: {
    fontWeight: "bold",
    fontSize: 13,
  },
  replyInputArea: {
    marginTop: 6,
  },

  // ProfileScreen
  subTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkboxLabel: {
    marginLeft: 8,
  },
  label: {
    fontSize: 18,
    marginBottom: 4,
  },
  value: {
    fontWeight: "bold",
  },
  flockItem: {
    fontSize: 16,
    marginLeft: 10,
    color: "#444",
  },
});
