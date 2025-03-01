import { LogBox } from 'react-native';
LogBox.ignoreLogs([
    'Draggable: Support for defaultProps will be removed'
]);

import React, { useState, useEffect } from 'react';
import {
    View,
    ImageBackground,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Audio } from 'expo-av';
import { NavigationProp } from '@react-navigation/native';
import BackButton from '../../misc/BackButton';
import NextButton from '../../misc/NextButton';

const bgImage = require('@/assets/images/lv3bg.jpg');

// Draggable elements data with names for matching
const draggableElements = [
    { id: 1, name: 'u_tto', image: require('@/assets/images/u_tto2.png'), audio: require('@/assets/audios/utto.wav') },
    { id: 2, name: 'uko', image: require('@/assets/images/uko2.png'), audio: require('@/assets/audios/uko.wav') },
    { id: 3, name: 'etsok', image: require('@/assets/images/etsok2.png'), audio: require('@/assets/audios/etsok.wav') },
    { id: 4, name: 'u_tsi', image: require('@/assets/images/u_tsi2.png'), audio: require('@/assets/audios/utsi.wav') },
];

// Drop zones with predefined positions, sizes, and rotations
const dropZonesData = [
    { id: 1, matchName: 'u_tto', x: 90, y: 240, width: 130, height: 80, rotation: '-60deg', borderColor: 'red', expectedColor: 'rgba(255, 0, 0, 0.3)' },
    { id: 2, matchName: 'uko', x: 490, y: 170, width: 80, height: 90, rotation: '-29deg', borderColor: 'blue', expectedColor: 'rgba(0, 0, 255, 0.3)' },
    { id: 3, matchName: 'etsok', x: 190, y: 80, width: 420, height: 25, rotation: '-20deg', borderColor: 'green', expectedColor: 'rgba(0, 255, 0, 0.3)' },
    { id: 4, matchName: 'u_tsi', x: 380, y: -50, width: 220, height: 500, rotation: '70deg', borderColor: 'purple', expectedColor: 'rgba(128, 0, 128, 0.3)' },
];

const Level3 = ({ navigation }: { navigation: NavigationProp<any> }) => {
    // State to track which word is currently selected
    const [selectedWord, setSelectedWord] = useState<any>(null);
    // State to track matches, where key is the word name and value is the color
    const [matches, setMatches] = useState<Record<string, string>>({});
    const [canContinue, setCanContinue] = useState(false);
    // State to keep track of words that haven't been matched yet
    const [words, setWords] = useState([...draggableElements]);

    const playSound = async (audio: any) => {
        const { sound } = await Audio.Sound.createAsync(audio);
        await sound.playAsync();
    };

    // Handle word selection
    const handleWordPress = (word: any) => {
        if (matches[word.name]) return; // Already matched
        if (selectedWord && selectedWord.name === word.name) {
            setSelectedWord(null);
        } else {
            setSelectedWord(word);
        }
    };

    // Handle drop zone press
    const handleDropZonePress = (zone: any) => {
        if (!selectedWord) return;
        if (selectedWord.name === zone.matchName) {
            setMatches((prev) => ({ ...prev, [zone.matchName]: zone.expectedColor }));
            playSound(selectedWord.audio);
            setWords((prev) => prev.filter((word) => word.name !== selectedWord.name));
        }
        setSelectedWord(null);
    };

    // When all words have been matched, enable Next button
    useEffect(() => {
        if (Object.keys(matches).length === draggableElements.length) {
            setCanContinue(true);
        }
    }, [matches]);

    return (
        <View style={{ flex: 1 }}>
            <ImageBackground source={bgImage} style={styles.container}>
                <BackButton navigation={navigation} />
                {canContinue && <NextButton navigation={navigation} nextName="LevelMapping" />}

                {/* Drop Zones Positioned Individually with Custom Styles */}
                <View style={styles.dropZonesContainer}>
                    {dropZonesData.map((item) => (
                        <TouchableOpacity
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
                                    backgroundColor: matches[item.matchName] ? matches[item.matchName] : 'transparent',
                                }
                            ]}
                            onPress={() => handleDropZonePress(item)}
                            activeOpacity={0.7}
                        />
                    ))}
                </View>

                {/* Word items in a horizontal scroll */}
                <ScrollView horizontal style={styles.draggableContainer}>
                    {words.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                                styles.whiteContainer,
                                selectedWord && selectedWord.name === item.name && styles.selectedWord,
                                matches[item.name] && { backgroundColor: matches[item.name] },
                            ]}
                            onPress={() => handleWordPress(item)}
                            disabled={!!matches[item.name]}
                        >
                            <Image source={item.image} style={styles.draggableImage} />
                        </TouchableOpacity>
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
        backgroundColor: 'transparent',
    },
});

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    dropZonesContainer: { 
        position: 'absolute', 
        width: '100%', 
        height: '100%' 
    },
    draggableContainer: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        width: '100%',
        paddingVertical: 10,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    draggableImage: {
        width: 150, 
        height: 40, 
        resizeMode: 'cover',
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
    selectedWord: {
        borderWidth: 2,
        borderColor: 'blue',
    },
});

export default Level3;