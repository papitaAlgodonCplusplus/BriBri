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

const bgImage = require('@/assets/images/lv3bg.jpg');

// Draggable elements data
const draggableElements = [
    { id: 1, image: require('@/assets/images/u_tto2.png'), audio: require('@/assets/audios/utto.wav') },
    { id: 2, image: require('@/assets/images/uko2.png'), audio: require('@/assets/audios/uko.wav') },
    { id: 3, image: require('@/assets/images/etsok2.png'), audio: require('@/assets/audios/etsok.wav') },
    { id: 4, image: require('@/assets/images/u_tsi2.png'), audio: require('@/assets/audios/utsi.wav') },
];

// Drop zones with predefined positions, sizes, and rotations
const dropZonesData = [
    { id: 1, x: 90, y: 240, width: 130, height: 80, rotation: '-60deg', borderColor: 'red', backgroundColor: 'rgba(255, 0, 0, 0.3)' },   // Drop zone for first element
    { id: 2, x: 490, y: 170, width: 80, height: 90, rotation: '-29deg', borderColor: 'blue', backgroundColor: 'rgba(0, 0, 255, 0.3)' },  // Drop zone for second element
    { id: 3, x: 190, y: 80, width: 420, height: 25, rotation: '-20deg', borderColor: 'green', backgroundColor: 'rgba(0, 255, 0, 0.3)' }, // Drop zone for third element
    { id: 4, x: 380, y: -50, width: 220, height: 500, rotation: '70deg', borderColor: 'purple', backgroundColor: 'rgba(128, 0, 128, 0.3)' }, // Drop zone for fourth element
];


const Level3 = ({ navigation }: { navigation: NavigationProp<any> }) => {
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
        const DRAGGABLE_SIZE = -20;

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
                        />
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
        width: 150, height: 40, resizeMode: 'cover',
        overflow: 'visible',
        marginLeft: 10,
    },
    whiteContainer: {
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 10,
        padding: 5,
        width: 170,
        height: 40,
        alignItems: 'center',
        marginHorizontal: 10,
    },
});

export default Level3;
