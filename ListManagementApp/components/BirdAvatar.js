import React from 'react';
import { Image, StyleSheet } from 'react-native';
import globalStyles from "../styles";

export default function BirdAvatar({ uri, size }) {
  return <Image source={{ uri }} style={[globalStyles.avatar, { width: size, height: size }]} />;
}

