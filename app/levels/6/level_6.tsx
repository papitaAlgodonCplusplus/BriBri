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

const bgImage = require('@/assets/images/ilustraciones-04.jpg');

// Draggable elements data (Placeholder names, adjust if necessary)
const draggableElements = [
    { id: 1, image: require('@/assets/images/ukko2.png'), audio: require('@/assets/audios/ukko.wav') },
    { id: 2, image: require('@/assets/images/ushu2.png'), audio: require('@/assets/audios/ushu.wav') },
    { id: 3, image: require('@/assets/images/akwawe2.png'), audio: require('@/assets/audios/ak_wawe.wav') },
    { id: 4, image: require('@/assets/images/ulok2.png'), audio: require('@/assets/audios/ulok.wav') },
    { id: 5, image: require('@/assets/images/iwo2.png'), audio: require('@/assets/audios/iwo.wav') },
    { id: 6, image: require('@/assets/images/ko2.png'), audio: require('@/assets/audios/ko.wav') },
    { id: 7, image: require('@/assets/images/kapokua2.png'), audio: require('@/assets/audios/kapokua.wav') },
];

// Drop zones with predefined positions, sizes, and rotations
const dropZonesData = [
    // ukko2
    { id: 2, x: 400, y: 270, width: 150, height: 80, rotation: '0deg', borderColor: 'purple', backgroundColor: 'rgba(128, 0, 128, 0.3)' },
    { id: 3, x: 120, y: 30, width: 80, height: 60, rotation: '0deg', borderColor: 'blue', backgroundColor: 'rgba(0, 0, 255, 0.3)' },          // akwawe2
    { id: 4, x: 250, y: 35, width: 100, height: 20, rotation: '0deg', borderColor: 'orange', backgroundColor: 'rgba(255, 165, 0, 0.3)' },  // ulok2
    { id: 5, x: 170, y: 60, width: 40, height: 30, rotation: '0deg', borderColor: 'red', backgroundColor: 'rgba(255, 0, 0, 0.3)' },    // iwo2
    { id: 6, x: 450, y: 30, width: 100, height: 30, rotation: '0deg', borderColor: 'yellow', backgroundColor: 'rgba(255, 255, 0, 0.3)' },  // ko2
    { id: 7, x: 450, y: 140, width: 100, height: 25, rotation: '0deg', borderColor: 'cyan', backgroundColor: 'rgba(0, 255, 255, 0.3)' },   // kapokua2
];


const Level6 = ({ navigation }: { navigation: NavigationProp<any> }) => {
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
        const DRAGGABLE_SIZE = 10;

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
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scoreContainer: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 10,
    },
    scoreText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    dropZonesContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
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
        width: 80,
        height: 40,
        resizeMode: 'cover',
        overflow: 'visible',
        marginLeft: 10,
    },
    whiteContainer: {
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 10,
        padding: 5,
        width: 100,
        height: 40,
        alignItems: 'center',
        marginHorizontal: 10,
    },
});

export default Level6;
