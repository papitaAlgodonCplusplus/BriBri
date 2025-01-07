import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '@/app/misc/BackButton';
import NextButton from '@/app/misc/NextButton';
import { Audio } from 'expo-av';
import { NavigationProp } from '@react-navigation/native';

const Guide = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const bgImage = require('@/assets/images/pantalla_sin_elementos.jpg');

    const [mode, setMode] = useState<'read' | 'listen' | null>(null);
    const [imagesEnabled, setImagesEnabled] = useState(true);

    useEffect(() => {
        const fetchMode = async () => {
            const storedMode = await AsyncStorage.getItem('mode');
            setMode(storedMode === 'read' || storedMode === 'listen' ? storedMode : 'listen');
        };
        fetchMode();
    }, []);

    const playSound = async (audio: any): Promise<void> => {
        if (mode === 'listen') {
            const { sound } = await Audio.Sound.createAsync(audio);
            await sound.playAsync();
        }
    };

    const toggleImages = () => {
        setImagesEnabled((prev) => !prev);
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ImageBackground source={bgImage} style={styles.container} imageStyle={{ opacity: imagesEnabled ? 0.6 : 1.0 }}>
                <BackButton navigation={navigation} />
                <NextButton navigation={navigation} nextName="Level2" />

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

                {guide_elements.map((element) => (
                    <View key={element.id} style={styles[`guideElement${element.id}`]}>
                        <TouchableOpacity
                            onPress={() => playSound(element.audio)}
                            disabled={mode === 'read' || !imagesEnabled}
                        >
                            {imagesEnabled && <Image source={element.image} style={styles[`image${element.id}`]} />}
                        </TouchableOpacity>
                        {mode === 'read' && imagesEnabled && (
                            <Image source={element.wordImage} style={styles[`wordImage${element.id}`]} />
                        )}
                    </View>
                ))}
            </ImageBackground>
        </View>
    );
};

const guide_elements = [
    {
        id: 1,
        image: require('@/assets/images/chamulikata.png'),
        wordImage: require('@/assets/images/chamulikata2.png'),
        audio: require('@/assets/audios/cahmulikata.wav'),
        label: 'Palo Frente',
    }
    ,
    {
        id: 2,
        image: require('@/assets/images/i_kule.png'),
        wordImage: require('@/assets/images/i_kule2.png'),
        audio: require('@/assets/audios/ikule.wav'),
        label: 'Palo Pequeño',
    }
    ,
    {
        id: 3,
        image: require('@/assets/images/nak_kata.png'),
        wordImage: require('@/assets/images/nak_kata2.png'),
        audio: require('@/assets/audios/nakkata.wav'),
        label: 'Palo Largo',
    }
    ,
    {
        id: 4,
        image: require('@/assets/images/se.png'),
        wordImage: require('@/assets/images/se2.png'),
        audio: require('@/assets/audios/se.wav'),
        label: 'Pedestal',
    },
    {
        id: 5,
        image: require('@/assets/images/tso_klowok.png'),
        wordImage: require('@/assets/images/tso_klowok2.png'),
        audio: require('@/assets/audios/tsoklowok.wav'),
        label: 'Palo Grueso',
    },
    {
        id: 6,
        image: require('@/assets/images/tso.png'),
        wordImage: require('@/assets/images/tso2.png'),
        audio: require('@/assets/audios/tso.wav'),
        label: 'Soporte',
    },
];

const styles: { [key: string]: any } = StyleSheet.create({
    container: {
        flex: 1,
    },
    label: {
        position: 'absolute',
        top: 20,
        right: 20,
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 10,
        borderRadius: 5,
        zIndex: 1,
    },
    guideElement1: {
        position: 'absolute',
        top: 175,
        left: 248,
    },
    guideElement2: {
        position: 'absolute',
        top: 36,
        left: 330,
    },
    guideElement3: {
        position: 'absolute',
        top: -79,
        left: 370,
    },
    guideElement4: {
        position: 'absolute',
        top: 190,
        left: 83,
    },
    guideElement5: {
        position: 'absolute',
        top: 185,
        left: 250,
    },
    guideElement6: {
        position: 'absolute',
        top: 12,
        left: 290,
    },
    image1: {
        width: 250,
        height: 100,
        transform: [{ rotate: '18deg' }],
        resizeMode: 'contain',
    },
    image2: {
        width: 450,
        height: 200,
        transform: [{ rotate: '-13deg' }],
        resizeMode: 'contain',
    },
    image3: {
        width: 450,
        height: 500,
        transform: [{ rotate: '-30deg' }],
        resizeMode: 'contain',
    },
    image4: {
        width: 380,
        height: 180,
        resizeMode: 'contain',
    },
    image5: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
    image6: {
        width: 420,
        height: 200,
        transform: [{ rotate: '-27deg' }],
        resizeMode: 'contain',
    },
    wordImage1: {
        width: 130,
        height: 60,
        resizeMode: 'contain',
        position: 'absolute',
        top: 15,
        left: 90,
        transform: [{ rotate: '18deg' }],
    },
    wordImage2: {
        width: 180,
        height: 100,
        resizeMode: 'contain',
        position: 'absolute',
        top: 80,
        left: 115,
        transform: [{ rotate: '-13deg' }],
    },
    wordImage3: {
        width: 170,
        height: 80,
        resizeMode: 'contain',
        position: 'absolute',
        top: 245,
        left: 150,
        transform: [{ rotate: '-32deg' }],
    },
    wordImage4: {
        width: 200,
        height: 80,
        resizeMode: 'contain',
        position: 'absolute',
        top: 40,
        left: 75,
        transform: [{ rotate: '-90deg' }],
    },
    wordImage5: {
        width: 160,
        height: 80,
        transform: [{ rotate: '-90deg' }],
        resizeMode: 'contain',
        position: 'absolute',
        top: 80,
        left: 5,
    },
    wordImage6: {
        width: 180,
        height: 80,
        resizeMode: 'contain',
        position: 'absolute',
        top: 5,
        left: 170,
        transform: [{ rotate: '-27deg' }],
    },
});

export default Guide;
