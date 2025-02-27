import React, { useState, useEffect } from 'react';
import { View, ImageBackground, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import { Audio } from 'expo-av';
import BackButton from '@/app/misc/BackButton';
import NextButton from '@/app/misc/NextButton';

const GuideListen = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const bgImage = require('@/assets/images/guia2.png');

    const [mode, setMode] = useState<'read' | 'listen' | null>(null);

    useEffect(() => {
        const fetchMode = async () => {
            const storedMode = await AsyncStorage.getItem('mode');
            setMode(storedMode === 'read' || storedMode === 'listen' ? storedMode : 'listen');
        };
        fetchMode();
    }, []);

    // Draggable elements now hold only audio information.
    // Their order corresponds exactly with the drop zones defined below.
    const draggableElements = [
        { name: 'audio1', audio: require('@/assets/audios/cahmulikata.wav') },
        { name: 'audio2', audio: require('@/assets/audios/ikule.wav') },
        { name: 'audio3', audio: require('@/assets/audios/nakkata.wav') },
        { name: 'audio4', audio: require('@/assets/audios/se.wav') },
        { name: 'audio5', audio: require('@/assets/audios/tsoklowok.wav') },
        { name: 'audio6', audio: require('@/assets/audios/tso.wav') },
    ];

    // Audio boxes styled exactly as the drop zones in Level2Listen.
    const dropZoneStyles = StyleSheet.create({
        zoneContainer1: {
            position: 'absolute',
            left: 445,
            top: 205,
            width: 120,
            height: 30,
            transform: [{ rotate: '20deg' }],
            borderColor: 'red',
            backgroundColor: 'rgba(255, 0, 0, 0.3)',
            borderWidth: 3,
            justifyContent: 'center',
            alignItems: 'center',
        },
        zoneContainer2: {
            position: 'absolute',
            left: 450,
            top: 110,
            width: 350,
            height: 25,
            transform: [{ rotate: '-15deg' }],
            borderColor: 'blue',
            backgroundColor: 'rgba(0, 0, 255, 0.3)',
            borderWidth: 3,
            justifyContent: 'center',
            alignItems: 'center',
        },
        zoneContainer3: {
            position: 'absolute',
            left: 545,
            top: 135,
            width: 330,
            height: 30,
            transform: [{ rotate: '-30deg' }],
            borderColor: 'green',
            backgroundColor: 'rgba(0, 255, 0, 0.3)',
            borderWidth: 3,
            justifyContent: 'center',
            alignItems: 'center',
        },
        zoneContainer4: {
            position: 'absolute',
            left: 290,
            top: 250,
            width: 170,
            height: 25,
            transform: [{ rotate: '90deg' }],
            borderColor: 'purple',
            backgroundColor: 'rgba(128, 0, 128, 0.3)',
            borderWidth: 3,
            justifyContent: 'center',
            alignItems: 'center',
        },
        zoneContainer5: {
            position: 'absolute',
            left: 370,
            top: 280,
            width: 160,
            height: 25,
            transform: [{ rotate: '90deg' }],
            borderColor: 'orange',
            backgroundColor: 'rgba(255, 165, 0, 0.3)',
            borderWidth: 3,
            justifyContent: 'center',
            alignItems: 'center',
        },
        zoneContainer6: {
            position: 'absolute',
            left: 450,
            top: 70,
            width: 320,
            height: 25,
            transform: [{ rotate: '-27deg' }],
            borderColor: 'pink',
            backgroundColor: 'rgba(255, 192, 203, 0.3)',
            borderWidth: 3,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });

    const audioBoxesData = [
        { name: 'audio1', style: dropZoneStyles.zoneContainer1 },
        { name: 'audio2', style: dropZoneStyles.zoneContainer2 },
        { name: 'audio3', style: dropZoneStyles.zoneContainer3 },
        { name: 'audio4', style: dropZoneStyles.zoneContainer4 },
        { name: 'audio5', style: dropZoneStyles.zoneContainer5 },
        { name: 'audio6', style: dropZoneStyles.zoneContainer6 },
    ];

    const playSound = async (audio: any) => {
        try {
            const { sound } = await Audio.Sound.createAsync(audio);
            await sound.playAsync();
        } catch (error) {
            console.error('Error playing sound', error);
        }
    };

    const handleAudioBoxPress = (name: string) => {
        const element = draggableElements.find(e => e.name === name);
        if (element) {
            playSound(element.audio);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ImageBackground source={bgImage} style={styles.bgImage} />
            <BackButton navigation={navigation} />
            <View style={styles.audioBoxesContainer}>
                {audioBoxesData.map((box) => (
                    <TouchableOpacity
                        key={box.name}
                        style={box.style}
                        onPress={() => handleAudioBoxPress(box.name)}
                    >
                        <Image source={require('@/assets/images/audio.png')} style={styles.audioIcon} />
                    </TouchableOpacity>
                ))}
            </View>
            <NextButton navigation={navigation} nextName="Level2Listen" />
        </View>
    );
};

const styles = StyleSheet.create({
    bgImage: {
        flex: 1,
        resizeMode: 'stretch',
        justifyContent: 'center',
        width: '90%',
        height: '100%',
        top: 0,
        left: 190,
    },
    audioBoxesContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    audioIcon: {
        width: 30,
        height: 30,
    },
});

export default GuideListen;
