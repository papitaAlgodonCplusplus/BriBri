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

const bgImage = require('@/assets/images/lv_1_bg.png');

// Draggable elements data
const draggableElements = [
    {
        id: 1,
        image: require('@/assets/images/hamaca.png'),
        wordImage: require('@/assets/images/nolo_nkuo.png'),
        audio: require('@/assets/audios/nolo_nkuo_caminito_de_la_casa.wav'),
        label: 'Hamaca',
    },
    {
        id: 2,
        image: require('@/assets/images/techo_frente.png'),
        wordImage: require('@/assets/images/nolo_kibi.png'),
        audio: require('@/assets/audios/nolo_kibi_camino_antes_de_la_casa.wav'),
        label: 'Techo Frente',
    },
    {
        id: 3,
        image: require('@/assets/images/camino.png'),
        wordImage: require('@/assets/images/kapo.png'),
        audio: require('@/assets/audios/kapo_hamaca.wav'),
        label: 'Camino',
    },
    {
        id: 4,
        image: require('@/assets/images/entrada.png'),
        wordImage: require('@/assets/images/ale.png'),
        audio: require('@/assets/audios/ale_alero.wav'),
        label: 'Entrada',
    },
];

const shuffleArray = (array: any[]) => {
    return array.sort(() => Math.random() - 0.5);
};

const Level1 = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const [score, setScore] = useState(0);
    const [draggables, setDraggables] = useState(shuffleArray([...draggableElements]));
    const [dropZonesData] = useState(shuffleArray([...draggableElements]));
    const dropZones = useRef<Record<number, LayoutRectangle>>({});

    // Play sound function
    const playSound = async (audio: any) => {
        const { sound } = await Audio.Sound.createAsync(audio);
        await sound.playAsync();
    };

    // Handle drop event
    const handleDrop = (item: { id: any; image?: any; wordImage?: any; audio: any; label?: string; }, gestureState: PanResponderGestureState) => {
        const dropZone = dropZones.current[item.id];
        const DRAGGABLE_SIZE = 100; // Size of the draggable element

        if (
            dropZone &&
            gestureState.moveX + DRAGGABLE_SIZE / 2 >= dropZone.x - 25 &&
            gestureState.moveX - DRAGGABLE_SIZE / 2 <= dropZone.x - 25 + dropZone.width &&
            gestureState.moveY + DRAGGABLE_SIZE / 2 >= dropZone.y - 45 &&
            gestureState.moveY - DRAGGABLE_SIZE / 2 <= dropZone.y - 45 + dropZone.height
        ) {
            setScore((prevScore) => prevScore + 1);
            playSound(item.audio);
            setDraggables((prev: typeof draggableElements) => prev.filter((element) => element.id !== item.id));
        } else {
            const neededX = dropZone.x - gestureState.moveX;
            const neededY = dropZone.y - gestureState.moveY;
            console.log(`Missed Drop Zone. Needed +X: ${neededX.toFixed(2)}, +Y: ${neededY.toFixed(2)}`);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
            <ImageBackground source={bgImage} style={styles.container} imageStyle={{ opacity: 0.5 }}>
                {/* Back Button */}
                <BackButton navigation={navigation} />

                {/* Score Display */}
                <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>Score: {score}</Text>
                </View>

                {/* Draggable Elements in Green Containers */}
                <View style={styles.horizontalContainer}>
                    {draggables.map((item: typeof draggableElements[0]) => (
                        <View key={item.id} style={styles.greenContainer}>
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

                {/* Word Elements in White Containers (Drop Zones) */}
                <View style={styles.horizontalContainer}>
                    {dropZonesData.map((item: typeof draggableElements[0]) => (
                        <View
                            key={item.id}
                            style={styles.whiteContainer}
                            ref={(ref) => {
                                if (ref) {
                                    ref.measure((_, __, width, height, pageX, pageY) => {
                                        dropZones.current[item.id] = { x: pageX, y: pageY, width, height };
                                    });
                                }
                            }}
                        >
                            <Image source={item.wordImage} style={styles.wordImage} />
                        </View>
                    ))}
                </View>
            </ImageBackground>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    scoreContainer: {
        position: 'absolute',
        top: 50,
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
    horizontalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        marginVertical: 20,
        marginTop: 100,
    },
    greenContainer: {
        width: 70,
        height: 70,
        backgroundColor: 'rgba(0, 255, 0, 0.3)',
        borderColor: 'green',
        borderWidth: 2,
        borderRadius: 35, // Change to circle
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    whiteContainer: {
        width: 60,
        height: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 30, // Change to circle
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    draggableImage: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
        transform: [{
            translateX: 3,
        }],
    },
    wordImage: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
    },
});

export default Level1;
