import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

export default function BirdListView({ title, birds, emptyMessage }) {
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {birds.length === 0 ? (
                <Text style={styles.emptyList}>{emptyMessage}</Text>
            ) : (
                <FlatList
                    data={birds}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Text style={styles.item}>
                            {item.name}
                            {item.date ? ` - ${formatDate(item.date)}` : ""}
                        </Text>
                    )}
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