import React, { useState, useEffect, useRef } from 'react';
import { View, Dimensions, Animated } from 'react-native';
import BirdAvatar from './BirdAvatar';
import Obstacle   from './Obstacle';
import StorageService from '../services/StorageService';

export default function GameEngine({ onGameOver }) {
  const screen = Dimensions.get('window');
  const [bird, setBird] = useState(null);
  const birdY = useRef(new Animated.Value(screen.height / 2)).current;
  const [obstacles, setObstacles] = useState([]);

  useEffect(() => {
    StorageService.getLastBird().then(setBird);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      const x = screen.width;
      const y = Math.random() * (screen.height - 80);
      setObstacles(prev => [...prev, { id: Date.now(), x, y }]);
    }, 2000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      setObstacles(prev =>
        prev
          .map(o => ({ ...o, x: o.x - 5 }))
          .filter(o => o.x > -40)
      );
    }, 16);
    return () => clearInterval(iv);
  }, []);

  if (!bird) return null;

  return (
    <View style={{ flex: 1, backgroundColor: '#e0f7fa' }}>
      <Animated.View
        style={[
          { position: 'absolute', left: 50 },
          { top: birdY }         // Animated.Value works here
        ]}
      >
        <BirdAvatar
          uri={bird.image || bird.defaultImageUri}
          size={60}
        />
      </Animated.View>

      {obstacles.map(({ id, x, y }) =>
        <Obstacle key={id} x={x} y={y} />
      )}
    </View>
  );
}
