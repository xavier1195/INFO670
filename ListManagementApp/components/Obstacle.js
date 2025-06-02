import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function Obstacle({ x, y }) {
  return <View style={[styles.obstacle, { left: x, top: y }]} />;
}

const styles = StyleSheet.create({
  obstacle: {
    position: 'absolute',
    width: 40,
    height: 40,
    backgroundColor: 'red',
    borderRadius: 5,
  },
});