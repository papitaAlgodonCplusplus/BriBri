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

const bgImage = require('@/assets/images/ilustraciones-03.jpg');

// Draggable elements data now with names for matching
const draggableElements = [
    { id: 1, name: 'kowolo', image: require('@/assets/images/kowolo2.png'), audio: require('@/assets/audios/kowolo.wav') },
    { id: 2, name: 'klowok', image: require('@/assets/images/klowok2.png'), audio: require('@/assets/audios/klowok.wav') },
    { id: 3, name: 'kochane', image: require('@/assets/images/kochane2.png'), audio: require('@/assets/audios/kochane.wav') },
    { id: 4, name: 'kokata', image: require('@/assets/images/kokata2.png'), audio: require('@/assets/audios/kokata.wav') },
];

// Drop zones with predefined positions, sizes, and rotations
const dropZonesData = [
    { id: 1, matchName: 'kowolo', x: 270, y: 180, width: 30, height: 15, rotation: '-90deg', borderColor: 'red', expectedColor: 'rgba(255, 0, 0, 0.3)' },      // Drop zone for first element
    { id: 2, matchName: 'klowok', x: 620, y: 0, width: 30, height: 150, rotation: '0deg', borderColor: 'yellow', expectedColor: 'rgba(255, 255, 0, 0.3)' },    // Drop zone for second element
    { id: 3, matchName: 'kochane', x: 305, y: 60, width: 70, height: 70, rotation: '10deg', borderColor: 'purple', expectedColor: 'rgba(128, 0, 128, 0.3)' }, // Drop zone for third element
    { id: 4, matchName: 'kokata', x: 570, y: 235, width: 170, height: 50, rotation: '0deg', borderColor: 'green', expectedColor: 'rgba(0, 128, 0, 0.3)' },    // Drop zone for fourth element
];

const Level4 = ({ navigation }: { navigation: NavigationProp<any> }) => {
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
        overflow: 'visible',
    },
    draggableImage: {
        width: 150, 
        height: 40, 
        resizeMode: 'cover',
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
    selectedWord: {
        borderWidth: 2,
        borderColor: 'blue',
    },
});

export default Level4;