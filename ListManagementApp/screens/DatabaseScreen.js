import React, { useState, useEffect, use } from "react";
import { View } from "react-native";
import { getBirdsFromCloud } from "../database/firebaseDatabase"; // Import your database functions
import BirdListView from "../components/BirdListView";

export default function DatabaseScreen() {
    const [birdsLog, setBirdsLog] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const data = await getBirdsFromCloud();
            setBirdsLog(data);
        };
        getData();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <BirdListView
                title="Birds Log"
                birds={birdsLog}
                emptyMessage="No birds logged yet."
            />
        </View>
    );
}
