import { LogBox } from 'react-native';
LogBox.ignoreLogs([
    'Draggable: Support for defaultProps will be removed'
]);

import React, { useState, useRef } from 'react';
import {
    View,
    ImageBackground,
    Image,
    Text,
    StyleSheet,
    ScrollView,
    LayoutRectangle,
    PanResponderGestureState,
} from 'react-native';
import { Audio } from 'expo-av';
import Draggable from 'react-native-draggable';
import { NavigationProp } from '@react-navigation/native';
import BackButton from '../../misc/BackButton';
import NextButton from '../../misc/NextButton';

const bgImage = require('@/assets/images/pantalla_sin_elementos.jpg');

// Draggable elements data
const draggableElements = [
    { id: 1, image: require('@/assets/images/chamulikata2.png'), audio: require('@/assets/audios/cahmulikata.wav'), label: 'chamulikata2' },
    { id: 2, image: require('@/assets/images/i_kule2.png'), audio: require('@/assets/audios/ikule.wav'), label: 'i_kule2' },
    { id: 3, image: require('@/assets/images/nak_kata2.png'), audio: require('@/assets/audios/nakkata.wav'), label: 'nak_kata2' },
    { id: 4, image: require('@/assets/images/se2.png'), audio: require('@/assets/audios/se.wav'), label: 'se2' },
    { id: 5, image: require('@/assets/images/tso_klowok2.png'), audio: require('@/assets/audios/tsoklowok.wav'), label: 'tso_klowok2' },
    { id: 6, image: require('@/assets/images/tso2.png'), audio: require('@/assets/audios/tso.wav'), label: 'tso2' },
];

// Drop zones with predefined positions, sizes, and rotations
const dropZonesData = [
    { id: 1, x: 345, y: 225, width: 120, height: 30, rotation: '20deg', borderColor: 'red', backgroundColor: 'rgba(255, 0, 0, 0.3)' },   // Drop zone 1
    { id: 2, x: 350, y: 130, width: 350, height: 25, rotation: '-15deg', borderColor: 'blue', backgroundColor: 'rgba(0, 0, 255, 0.3)' },  // Drop zone 2
    { id: 3, x: 445, y: 155, width: 330, height: 30, rotation: '-30deg', borderColor: 'green', backgroundColor: 'rgba(0, 255, 0, 0.3)' }, // Drop zone 3
    { id: 4, x: 190, y: 270, width: 170, height: 25, rotation: '90deg', borderColor: 'purple', backgroundColor: 'rgba(128, 0, 128, 0.3)' }, // Drop zone 4
    { id: 5, x: 270, y: 300, width: 160, height: 25, rotation: '90deg', borderColor: 'orange', backgroundColor: 'rgba(255, 165, 0, 0.3)' }, // Drop zone 5
    { id: 6, x: 350, y: 90, width: 320, height: 25, rotation: '-27deg', borderColor: 'pink', backgroundColor: 'rgba(255, 192, 203, 0.3)' }, // Drop zone 6
];


const Level2 = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const [score, setScore] = useState(0);
    const [draggables, setDraggables] = useState([...draggableElements]);
    const dropZones = useRef<Record<number, LayoutRectangle>>({});
    const [canContinue, setCanContinue] = useState(false);

    const playSound = async (audio: any) => {
        const { sound } = await Audio.Sound.createAsync(audio);
        await sound.playAsync();
    };

    const handleDrop = (item: any, gestureState: PanResponderGestureState) => {
        const dropZone = dropZones.current[item.id];
        const DRAGGABLE_SIZE = 20;

        if (
            dropZone &&
            gestureState.moveX + DRAGGABLE_SIZE >= dropZone.x &&
            gestureState.moveX - DRAGGABLE_SIZE <= dropZone.x + dropZone.width &&
            gestureState.moveY + DRAGGABLE_SIZE >= dropZone.y &&
            gestureState.moveY - DRAGGABLE_SIZE <= dropZone.y + dropZone.height
        ) {
            setScore((prevScore) => prevScore + 1);
            playSound(item.audio);
            setDraggables((prev) => prev.filter((draggable) => draggable.id !== item.id));

            if (score + 1 === draggableElements.length) {
                setCanContinue(true);
            }
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <ImageBackground source={bgImage} style={styles.container}>
                <BackButton navigation={navigation} />
                {canContinue && <NextButton navigation={navigation} nextName="LevelMapping" />}
                <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>Puntaje: {score}</Text>
                </View>

                {/* Drop Zones Positioned Individually with Custom Styles */}
                <View style={styles.dropZonesContainer}>
                    {dropZonesData.map((item) => (
                        <View
                            key={item.id}
                            style={[
                                dropZoneStyles.dropZone,
                                {
                                    left: item.x,
                                    top: item.y,
                                    width: item.width,
                                    height: item.height,
                                    transform: [{ rotate: item.rotation }],
                                    borderColor: item.borderColor,
                                    backgroundColor: item.backgroundColor,
                                }
                            ]}
                            ref={(ref) => {
                                if (ref) {
                                    ref.measure((_, __, width, height, pageX, pageY) => {
                                        dropZones.current[item.id] = { x: pageX, y: pageY, width, height };
                                    });
                                }
                            }}
                        >
                            <Text style={dropZoneStyles.label}></Text>
                        </View>
                    ))}
                </View>

                {/* Draggable Items in a Horizontal Line */}
                <ScrollView horizontal style={styles.draggableContainer}>
                    {draggables.map((item) => (
                        <View key={item.id} style={styles.whiteContainer}>
                            <Draggable
                                x={0}
                                y={0}
                                onDragRelease={(_, gestureState) => handleDrop(item, gestureState)}
                                shouldReverse={true}
                            >
                                <Image source={item.image} style={styles.draggableImage} />
                            </Draggable>
                            <Text style={styles.draggableLabel}></Text>
                        </View>
                    ))}
                </ScrollView>
            </ImageBackground>
        </View>
    );
};

const dropZoneStyles = StyleSheet.create({
    dropZone: {
        position: 'absolute',
        borderColor: 'black',
        borderWidth: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
    },
});

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scoreContainer: { position: 'absolute', top: 20, right: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 10 },
    scoreText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    dropZonesContainer: { position: 'absolute', width: '100%', height: '100%' },
    draggableContainer: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        width: '100%',
        paddingVertical: 10,
        backgroundColor: 'rgba(0,0,0,0.1)',
        overflow: 'visible',
    },
    draggableImage: {
        width: 110, height: 40, resizeMode: 'cover',
        overflow: 'visible',
    },
    draggableLabel: {
        textAlign: 'center',
        marginTop: 5,
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
    },
    whiteContainer: {
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 10,
        padding: 5,
        width: 110,
        alignItems: 'center',
        marginHorizontal: 10,
    },
});

export default Level2;
