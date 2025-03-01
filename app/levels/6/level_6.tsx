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
} from 'react-native';
import { Audio } from 'expo-av';
import { NavigationProp } from '@react-navigation/native';
import BackButton from '../../misc/BackButton';
import NextButton from '../../misc/NextButton';

const bgImage = require('@/assets/images/ilustraciones-04.jpg');

// Draggable elements data with names for matching
const draggableElements = [
    { id: 1, name: 'ukko', image: require('@/assets/images/ukko2.png'), audio: require('@/assets/audios/ukko.wav') },
    { id: 2, name: 'ushu', image: require('@/assets/images/ushu2.png'), audio: require('@/assets/audios/ushu.wav') },
    { id: 3, name: 'akwawe', image: require('@/assets/images/akwawe2.png'), audio: require('@/assets/audios/ak_wawe.wav') },
    { id: 4, name: 'ulok', image: require('@/assets/images/ulok2.png'), audio: require('@/assets/audios/ulok.wav') },
    { id: 5, name: 'iwo', image: require('@/assets/images/iwo2.png'), audio: require('@/assets/audios/iwo.wav') },
    { id: 6, name: 'ko', image: require('@/assets/images/ko2.png'), audio: require('@/assets/audios/ko.wav') },
    { id: 7, name: 'kapokua', image: require('@/assets/images/kapokua2.png'), audio: require('@/assets/audios/kapokua.wav') },
];

// Drop zones with predefined positions, sizes, and rotations
const dropZonesData = [
    { id: 1, matchName: 'ukko', x: 400, y: 270, width: 150, height: 80, rotation: '0deg', borderColor: 'purple', expectedColor: 'rgba(128, 0, 128, 0.3)' },
    { id: 2, matchName: 'ushu', x: 630, y: 40, width: 60, height: 50, rotation: '0deg',
        borderColor: 'red', expectedColor: 'rgba(255, 0, 0, 0.3)' },
    { id: 3, matchName: 'akwawe', x: 120, y: 30, width: 80, height: 60, rotation: '0deg', borderColor: 'blue', expectedColor: 'rgba(0, 0, 255, 0.3)' },
    { id: 4, matchName: 'ulok', x: 385, y: 10, width: 25, height: 60, rotation: '0deg', borderColor: 
        'green', expectedColor: 'rgba(0, 128, 0, 0.3)' },
    { id: 5, matchName: 'iwo', x: 170, y: 60, width: 40, height: 30, rotation: '0deg', borderColor: 'red', expectedColor: 'rgba(255, 0, 0, 0.3)' },
    { id: 6, matchName: 'ko', x: 470, y: 10, width: 40, height: 50, rotation: '0deg', borderColor: 'orange', expectedColor: 'rgba(255, 165, 0, 0.3)' },
    { id: 7, matchName: 'kapokua', x:600, y: 180, width: 100, height: 25, rotation: '-20deg', borderColor: 'yellow', expectedColor: 'rgba(255, 255, 0, 0.3)' },
];

const Level6 = ({ navigation }: { navigation: NavigationProp<any> }) => {
    // State to track which word is currently selected
    const [selectedWord, setSelectedWord] = useState<any>(null);
    // State to track matches, where key is the word name and value is the color
    const [matches, setMatches] = useState<Record<string, string>>({});
    const [canContinue, setCanContinue] = useState(false);
    // State to keep track of words that haven't been matched yet
    const [words, setWords] = useState([...draggableElements]);

    const playSound = async (audio: any) => {
        try {
            const { sound } = await Audio.Sound.createAsync(audio);
            await sound.playAsync();
        } catch (error) {
            console.error('Error playing sound', error);
        }
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
        console.log('Selected word:', selectedWord.name, 'Expected:', zone.matchName);
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

                {/* Words container - 40% width with wrapping at bottom of screen */}
                <View style={styles.wordsContainer}>
                    {words.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                                styles.wordButton,
                                selectedWord && selectedWord.name === item.name && styles.selectedWord,
                                matches[item.name] && { backgroundColor: matches[item.name] },
                            ]}
                            onPress={() => handleWordPress(item)}
                            disabled={!!matches[item.name]}
                        >
                            <Image source={item.image} style={styles.wordImage} />
                        </TouchableOpacity>
                    ))}
                </View>
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
        alignItems: 'center',
    },
    dropZonesContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    wordsContainer: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '40%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: 'rgba(0,0,0,0.2)',
        alignSelf: 'center',
    },
    wordButton: {
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 10,
        padding: 5,
        margin: 5,
        width: 100,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedWord: {
        borderWidth: 2,
        borderColor: 'blue',
    },
    wordImage: {
        width: 90,
        height: 35,
        resizeMode: 'contain',
    },
});

export default Level6;