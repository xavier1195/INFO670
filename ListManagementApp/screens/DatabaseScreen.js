import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { loadItems } from "../database"; // Import your database functions

export default function DatabaseScreen() {
    const [storedItems, setStoredItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await loadItems();
            setStoredItems(data);
        };
        fetchData();
    }
    , []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Database Screen</Text>
            {storedItems.length === 0 ? (
                <Text style={styles.emptyList}>No items found.</Text>
            ) : (
                <FlatList
                    data={storedItems}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <Text style={styles.item}>{item.name}</Text>}
                />
            )}
            </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    item: {
        fontSize: 18,
        paddingVertical: 10,
    },
    emptyList: {
        fontSize: 18,
        color: "#888",
    },
});


