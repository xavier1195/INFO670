import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import birdImagesData from '../database/birdImages';
import globalStyles from "../styles";

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
                <Image source={localImage} style={globalStyles.image} resizeMode='cover'/>
            ) : (
                <View style={globalStyles.placeholder} />
            );
        } catch (error) {
            return <View style={globalStyles.placeholder} />;
        }
    };


      export default BirdImage;
