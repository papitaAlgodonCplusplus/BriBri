import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '@/app/misc/BackButton';
import NextButton from '@/app/misc/NextButton';
import { NavigationProp } from '@react-navigation/native';

const Guide = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const bgImage = require('@/assets/images/lv6bg.jpg');
    const bgImageRef = require('@/assets/images/lv6bg_ref.png');

    const [mode, setMode] = useState<'read' | 'listen' | null>(null);
    const [imagesEnabled, setImagesEnabled] = useState(true);

    useEffect(() => {
        const fetchMode = async () => {
            const storedMode = await AsyncStorage.getItem('mode');
            setMode(storedMode === 'read' || storedMode === 'listen' ? storedMode : 'listen');
        };
        fetchMode();
    }, []);

    const toggleImages = () => {
        setImagesEnabled((prev) => !prev);
    };

    return (
        <View style={{ flex: 1 }}>
        <BackButton navigation={navigation} />

        <TouchableOpacity
            onPress={toggleImages}
            style={{
                zIndex: 2,
                padding: 10,
                backgroundColor: 'white',
                borderRadius: 5,
                bottom: 15,
                left: 15,
                position: 'absolute',
                width: 180,
                alignItems: 'center',
                opacity: 1.0,
            }}
        >
            <Text>{imagesEnabled ? "Desactivar Referencias" : "Activar Referencias"}</Text>
        </TouchableOpacity>
    <NextButton navigation={navigation} nextName="Level6" />
            <ImageBackground source={bgImage} style={styles.container}>
                <ImageBackground source={bgImageRef} style={styles.container2} imageStyle={{ opacity: imagesEnabled ? 1.0 : 0.0 }}>
                </ImageBackground>
            </ImageBackground>
        </View>
    );
};

const styles: { [key: string]: any } = StyleSheet.create({
    container: {
        resizeMode: 'cover',
        width: '90%',
        height: '90%',
        flex: 1,
        top: 16,
        left: 70,
    },
    container2: {
        resizeMode: 'cover',
        width: '95%',
        height: '95%',
        flex: 1,
        top: -10,
        left: -4,
    },
});

export default Guide;
