import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { getFlockBirds } from "../database/getFlockBirds";
import { getFlockMessages, addFlockMessage, addReplyToMessage, getRepliesForMessage } from "../database/flockMessages";
import FlockBirdItem from "../components/FlockBirdItem";

export default function FlockScreen() {
  const [birds, setBirds] = useState([]);
  const [flockName, setFlockName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState({});


  useEffect(() => {
    const fetchData = async () => {
      try {
        const { birds: flockBirds, flock } = await getFlockBirds();
        setBirds(flockBirds);
        setFlockName(flock);

        const loadedMessages = await getFlockMessages(flock);
        setMessages(loadedMessages);
      } catch (error) {
        console.error("Failed to load flock info:", error);
      } finally {
        setLoading(false);
      }
      const repliesObj = {};
for (let msg of loadedMessages) {
  repliesObj[msg.id] = await getRepliesForMessage(flock, msg.id);
}
setReplies(repliesObj);

    };

    fetchData();
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await addFlockMessage(flockName, newMessage);
      const updated = await getFlockMessages(flockName);
      setMessages(updated);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleSendReply = async (messageId) => {
    if (!replyText.trim()) return;

    try {
      await addReplyToMessage(flockName, messageId, replyText);
      const newReplies = await getRepliesForMessage(flockName, messageId);
      setReplies((prev) => ({ ...prev, [messageId]: newReplies }));
      setReplyText("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Failed to send reply:", error);
    }
  };

  // Helper to format a Firestore Timestamp
  const formatTimestamp = (ts) => {
    if (!ts || !ts.toDate) return "";
    return ts.toDate().toLocaleString();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {flockName ? `Your Flock ${flockName} is Flapping!` : "Loading Flock..."}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <FlatList
            data={birds}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <FlockBirdItem bird={item} />}
          />

<Text style={styles.sectionTitle}>Flock Messages</Text>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.message}>
                <Text style={styles.messageUser}>
                  {item.username} •{" "}
                  <Text style={styles.timestamp}>
                    {formatTimestamp(item.timestamp)}
                  </Text>
                </Text>
                <Text style={styles.messageText}>{item.message}</Text>

      {/* Replies */}
      {replies[item.id]?.map((reply) => (
        <View key={reply.id} style={styles.reply}>
          <Text style={styles.replyUser}>{reply.username}:</Text>
          <Text>{reply.reply}</Text>
        </View>
      ))}

      {/* Reply input */}
      {replyingTo === item.id ? (
        <View style={styles.replyInputArea}>
          <TextInput
            style={styles.input}
            placeholder="Write a reply..."
            value={replyText}
            onChangeText={setReplyText}
          />
          <Button title="Send" onPress={() => handleSendReply(item.id)} />
        </View>
      ) : (
        <Button title="Reply" onPress={() => setReplyingTo(item.id)} />
      )}
    </View>
  )}
/>

          <TextInput
            style={styles.input}
            placeholder="Send a message to your flock..."
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <Button title="Send Message" onPress={handleSendMessage} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginTop: 20, marginBottom: 10 },
  message: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#5f9ea0",
  },
  messageUser: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#5f9ea0",
    color: "#5f9ea0",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
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
  }

});
