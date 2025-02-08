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

const bgImage = require('@/assets/images/lv7bg_ref_2.png');

const draggableElements = [
    { id: 1, image: require('@/assets/images/aiko_ko2.png'), audio: require('@/assets/audios/ko.wav') },
    { id: 2, image: require('@/assets/images/kula2.png'), audio: require('@/assets/audios/kula.wav') },
    { id: 3, image: require('@/assets/images/kule2.png'), audio: require('@/assets/audios/kule.wav') },
    { id: 4, image: require('@/assets/images/sabak_dule2.png'), audio: require('@/assets/audios/sabak_dule.wav') },
    { id: 5, image: require('@/assets/images/sku2.png'), audio: require('@/assets/audios/sku.wav') },
    { id: 7, image: require('@/assets/images/to_ta2.png'), audio: require('@/assets/audios/to.wav') },
    { id: 8, image: require('@/assets/images/tska_tka2.png'), audio: require('@/assets/audios/tska.wav') },
    { id: 9, image: require('@/assets/images/u2.png'), audio: require('@/assets/audios/u.wav') },
];

// Drop zones with predefined positions, sizes, and rotations
const dropZonesData = [
    { id: 1, x: 220, y: 50, width: 60, height: 60, rotation: '0deg', borderColor: 'red', backgroundColor: 'rgba(255, 0, 0, 0.3)' },       // aiko_ko2.png
    { id: 2, x: 480, y: 230, width: 110, height: 90, rotation: '0deg', borderColor: 'blue', backgroundColor: 'rgba(0, 0, 255, 0.3)' },   // kula2.png
    { id: 3, x: 694, y: 225, width: 150, height: 80, rotation: '0deg', borderColor: 'green', backgroundColor: 'rgba(0, 255, 0, 0.3)' },  // kule2.png
    { id: 4, x: 50, y: 125, width: 60, height: 120, rotation: '0deg', borderColor: 'orange', backgroundColor: 'rgba(255, 165, 0, 0.3)' }, // sabak_dule2.png
    { id: 5, x: 395, y: 135, width: 80, height: 90, rotation: '0deg', borderColor: 'purple', backgroundColor: 'rgba(128, 0, 128, 0.3)' }, // sku2.png
    { id: 7, x: 215, y: 205, width: 80, height: 60, rotation: '0deg', borderColor: 'yellow', backgroundColor: 'rgba(255, 255, 0, 0.3)' }, // to_ta2.png
    { id: 8, x: 595, y: 125, width: 70, height: 90, rotation: '0deg', borderColor: 'cyan', backgroundColor: 'rgba(0, 255, 255, 0.3)' },  // tska_tka2.png
    { id: 9, x: 215, y: 128, width: 70, height: 70, rotation: '0deg', borderColor: 'pink', backgroundColor: 'rgba(255, 192, 203, 0.3)' }, // u2.png
];


const Level7 = ({ navigation }: { navigation: NavigationProp<any> }) => {
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
            </ImageBackground>
            <BackButton navigation={navigation} />
            {canContinue && <NextButton navigation={navigation} nextName="LevelMapping" />}
    

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
                            },
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
        width: '120%',
        justifyContent: 'center',
        alignItems: 'center',
        left: -150,
        top: -20,
        transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
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
        width: 110,
        height: 40,
        left: -15,
        resizeMode: 'cover',
        overflow: 'visible',
        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    },
    whiteContainer: {
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 10,
        padding: 5,
        width: 85,
        height: 40,
        alignItems: 'center',
        marginHorizontal: 10,
    },
});

export default Level7;
