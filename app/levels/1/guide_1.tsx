import React, { useState } from 'react';
import { ImageBackground, StyleSheet, View, Image, Text, TouchableOpacity, Button } from 'react-native';
import BackButton from '@/app/misc/BackButton';
import NextButton from '@/app/misc/NextButton';
import { Audio } from 'expo-av';
import { NavigationProp } from '@react-navigation/native';

const Guide = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const bgImage = require('@/assets/images/guide1.png');

    const [imagesEnabled, setImagesEnabled] = useState(true);

    interface GuideElement {
        id: number;
        image: any;
        wordImage: any;
        audio: any;
        label: string;
    }

    const playSound = async (audio: any): Promise<void> => {
        const { sound } = await Audio.Sound.createAsync(audio);
        await sound.playAsync();
    };

    const toggleImages = () => {
        setImagesEnabled((prev) => !prev);
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ImageBackground source={bgImage} style={styles.container} imageStyle={{ opacity: 0.7 }}>
                <BackButton navigation={navigation} />
                <NextButton navigation={navigation} nextName="Level1" />
                <Text style={styles.label}>Da tab sobre algun objeto para escuchar su pronunciación</Text>

                <TouchableOpacity onPress={toggleImages} style={{ zIndex: 2, padding: 10, backgroundColor: 'white', borderRadius: 5, bottom: 15, left: 15, position: 'absolute', width: 180, alignItems: 'center', opacity: 1.0 }}>
                    <Text>{imagesEnabled ? "Desactivar Referencias" : "Activar Referencias"}</Text>
                </TouchableOpacity>

                {guide_elements.map((element) => (
                    <View key={element.id} style={styles[`guideElement${element.id}`]}>
                        <TouchableOpacity onPress={() => playSound(element.audio)} disabled={!imagesEnabled}>
                            {imagesEnabled && <Image source={element.image} style={styles[`image${element.id}`]} />}
                        </TouchableOpacity>
                        {imagesEnabled && <Image source={element.wordImage} style={styles[`wordImage${element.id}`]} />}
                    </View>
                ))}
            </ImageBackground>
        </View>
    );
};

const guide_elements = [
    {
        id: 1,
        image: require('@/assets/images/hamaca_ref.png'),
        wordImage: require('@/assets/images/nolo_nkuo.png'),
        audio: require('@/assets/audios/nolo_nkuo_caminito_de_la_casa.wav'),
        label: 'Hamaca',
    },
    {
        id: 2,
        image: require('@/assets/images/techo_frente_ref.png'),
        wordImage: require('@/assets/images/nolo_kibi.png'),
        audio: require('@/assets/audios/nolo_kibi_camino_antes_de_la_casa.wav'),
        label: 'Techo Frente',
    },
    {
        id: 3,
        image: require('@/assets/images/camino_ref.png'),
        wordImage: require('@/assets/images/kapo.png'),
        audio: require('@/assets/audios/kapo_hamaca.wav'),
        label: 'Camino',
    },
    {
        id: 4,
        image: require('@/assets/images/entrada_ref.png'),
        wordImage: require('@/assets/images/ale.png'),
        audio: require('@/assets/audios/ale_alero.wav'),
        label: 'Entrada',
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
        top: 155,
        left: 550,
    },
    guideElement2: {
        position: 'absolute',
        top: -8,
        left: 363,
    },
    guideElement3: {
        position: 'absolute',
        top: 130,
        left: -100,
    },
    guideElement4: {
        position: 'absolute',
        top: 275,
        left: 275,
    },
    image1: {
        width: 300,
        height: 100,
        resizeMode: 'contain',
    },
    image2: {
        width: 200,
        height: 200,
        transform: [{ rotate: '-3deg' }],
        resizeMode: 'contain',
    },
    image3: {
        width: 500,
        height: 500,
        transform: [{ rotate: '-10deg' }],
        resizeMode: 'contain',
    },
    image4: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    wordImage1: {
        width: 220,
        height: 80,
        resizeMode: 'contain',
        position: 'absolute',
        top: 110,
        left: 50,
    },
    wordImage2: {
        width: 220,
        height: 80,
        resizeMode: 'contain',
        position: 'absolute',
        top: 130,
        left: -20,
        transform: [{ rotate: '18deg' }],
    },
    wordImage3: {
        width: 200,
        height: 80,
        resizeMode: 'contain',
        position: 'absolute',
        top: 120,
        left: 240,
        transform: [{ rotate: '10deg' }],
    },
    wordImage4: {
        width: 200,
        height: 80,
        resizeMode: 'contain',
        position: 'absolute',
        top: 40,
        left: -20,
        transform: [{ rotate: '-25deg' }],
    },
});

export default Guide;
