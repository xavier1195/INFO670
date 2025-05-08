import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import birdImagesData from '../database/birdImages';

const birdImages = ({ birdname }) => {
    const getImagePath = () => {
        for (const key in birdImages) {
            const bird = birdImagesData[key];
            if (key.toLowerCase() === birdname.toLowerCase()) {
                return birdImages.image_path;
            }
        }
        return null;
    };

    const imagePath = getImagePath();

    try {
        const localImage = imagePath
            ? require(`../assets/${imagePath}`)
            : null;

            return localImage ? (
                <Image source={localImage} style={styles.image} resizeMode='cover'/>
            ) : (
                <View style={styles.placeholder} />
            );
        } catch (error) {
            return <View style={styles.placeholder} />;
        }
    };

    const styles = StyleSheet.create({
        image: {
          width: 100,
          height: 100,
          borderRadius: 5,
          marginTop: 5,
        },
        placeholder: {
          width: 100,
          height: 100,
          backgroundColor: "#ccc",
          borderRadius: 5,
          marginTop: 5,
        },
      });

      export default BirdImage;
