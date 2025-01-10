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
    LayoutRectangle,
    PanResponderGestureState,
} from 'react-native';
import { Audio } from 'expo-av';
import Draggable from 'react-native-draggable';
import { NavigationProp } from '@react-navigation/native';
import BackButton from '../../misc/BackButton';
import NextButton from '../../misc/NextButton';

const bgImage = require('@/assets/images/guide1.png');

// Draggable elements data
const draggableElements = [
    {
        id: 1,
        image: require('@/assets/images/kapo.png'),
        audio: require('@/assets/audios/kapo_hamaca.wav'),
        label: 'Camino',
    },
    {
        id: 2,
        image: require('@/assets/images/nolo_nkuo.png'),
        audio: require('@/assets/audios/nolo_nkuo_caminito_de_la_casa.wav'),
        label: 'Hamaca',
    },
    {
        id: 3,
        image: require('@/assets/images/ale.png'),
        audio: require('@/assets/audios/ale_alero.wav'),
        label: 'Entrada',
    },
    {
        id: 4,
        image: require('@/assets/images/nolo_kibi.png'),
        audio: require('@/assets/audios/nolo_kibi_camino_antes_de_la_casa.wav'),
        label: 'Techo Frente',
    },
];

const shuffleArray = (array: any) => {
    return array
};

const Level1 = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const [score, setScore] = useState(0);
    const [draggables, setDraggables] = useState(shuffleArray([...draggableElements]));
    const [dropZonesData] = useState(shuffleArray([...draggableElements]));
    const dropZones = useRef<Record<number, LayoutRectangle>>({});
    const [canContinue, setCanContinue] = useState(false);

    // Play sound function
    const playSound = async (audio: any) => {
        const { sound } = await Audio.Sound.createAsync(audio);
        await sound.playAsync();
    };

    // Handle drop event
    const handleDrop = (item: any, gestureState: any) => {
        const dropZone = dropZones.current[item.id];
        const DRAGGABLE_SIZE = 30;

        if (
            dropZone &&
            gestureState.moveX + DRAGGABLE_SIZE >= dropZone.x &&
            gestureState.moveX - DRAGGABLE_SIZE <= dropZone.x + dropZone.width &&
            gestureState.moveY + DRAGGABLE_SIZE >= dropZone.y &&
            gestureState.moveY - DRAGGABLE_SIZE <= dropZone.y + dropZone.height
        ) {
            setScore((prevScore) => prevScore + 1);
            playSound(item.audio);
            setDraggables((prev: any) => prev.filter((draggable: any) => draggable.id !== item.id));

            if (score === 3) {
                setCanContinue(true);
            }
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <ImageBackground source={bgImage} style={styles.container}>
                {/* Back Button */}
                <BackButton navigation={navigation} />

                {/* Next Button */}
                {canContinue && <NextButton navigation={navigation} nextName="LevelMapping" />}

                {/* Score Display */}
                <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>Puntaje: {score}</Text>
                </View>

                {/* Draggable Elements at the Top */}
                <View style={styles.draggableContainer}>
                    {draggables.map((item: { id: number; image: any }) => (
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
                </View>

                {/* Drop Zones */}
                <View style={styles.dropZonesContainer}>
                    {dropZonesData.map((item: { id: number; image: any; audio: any; label: string }, index: number) => (
                        <View
                            key={item.id}
                            style={dropZoneStyles[`greenContainer${index + 1}`]}
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
            </ImageBackground>
        </View>
    );
};

const dropZoneStyles = StyleSheet.create({
    greenContainer1: {
        width: 230,
        height: 90,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        left: 580,
        top: -40,
        borderColor: 'red',
        borderWidth: 4,
    },
    greenContainer2: {
        width: 400,
        height: 80,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        left: -280,
        top: 100,
        transform: [{ rotate: '20deg' }],
        borderColor: 'orange',
        borderWidth: 4,
    },
    greenContainer3: {
        width: 120,
        height: 50,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        left: -430,
        top: 65,
        borderColor: 'yellow',
        borderWidth: 4,
    },
    greenContainer4: {
        width: 160,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        left: -430,
        top: -180,
        borderColor: 'green',
        borderWidth: 4,
    },
} as Record<string, any>);

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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 10,
    },
    scoreText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    draggableContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        marginTop: 40,
    },
    dropZonesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
    },
    draggableImage: {
        width: 180,
        height:  50,
        resizeMode: 'cover'
    },
    whiteContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 10,
        padding: 10,
        width: 200,
        height: 50,
        top: 220,
        zIndex: 2,
    },
});

export default Level1;
