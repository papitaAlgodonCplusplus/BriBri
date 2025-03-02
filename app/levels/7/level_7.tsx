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
    Dimensions,
} from 'react-native';
import { Audio } from 'expo-av';
import { NavigationProp } from '@react-navigation/native';
import BackButton from '../../misc/BackButton';
import NextButton from '../../misc/NextButton';

const bgImage = require('@/assets/images/ilustraciones-05.jpg');

// Draggable elements with names for matching
const draggableElements = [
    { id: 1, name: 'aiko_ko', image: require('@/assets/images/aiko_ko2.png'), audio: require('@/assets/audios/ko.wav') },
    { id: 2, name: 'kula', image: require('@/assets/images/kula2.png'), audio: require('@/assets/audios/kula.wav') },
    { id: 3, name: 'kule', image: require('@/assets/images/kule2.png'), audio: require('@/assets/audios/kule.wav') },
    { id: 4, name: 'sabak_dule', image: require('@/assets/images/sabak_dule2.png'), audio: require('@/assets/audios/sabak_dule.wav') },
    { id: 5, name: 'sku', image: require('@/assets/images/sku2.png'), audio: require('@/assets/audios/sku.wav') },
    { id: 7, name: 'to_ta', image: require('@/assets/images/to_ta2.png'), audio: require('@/assets/audios/to.wav') },
    { id: 8, name: 'tska_tka', image: require('@/assets/images/tska_tka2.png'), audio: require('@/assets/audios/tska.wav') },
    { id: 9, name: 'u', image: require('@/assets/images/u2.png'), audio: require('@/assets/audios/u.wav') },
];

// Base drop zone data with match names and styling
const baseDropZonesData = [
    { id: 1, matchName: 'aiko_ko', width: 80, height: 80, borderColor: 'red', expectedColor: 'rgba(255, 0, 0, 0.3)', x: 300, y: 300 },
    { id: 2, matchName: 'kula', width: 105, height: 95, borderColor: 'blue', expectedColor: 'rgba(0, 0, 255, 0.3)', x: 675, y: 280 },
    { id: 3, matchName: 'kule', width: 125, height: 90, borderColor: 'green', expectedColor: 'rgba(0, 255, 0, 0.3)', x: 548, y: 290 },
    { id: 4, matchName: 'sabak_dule', width: 80, height: 110, borderColor: 'orange', expectedColor: 'rgba(255, 165, 0, 0.3)', x: 465, y: 270 },
    { id: 5, matchName: 'sku', width: 90, height: 95, borderColor: 'purple', expectedColor: 'rgba(128, 0, 128, 0.3)', x: 584, y: 89 },
    { id: 7, matchName: 'to_ta', width: 90, height: 80, borderColor: 'yellow', expectedColor: 'rgba(255, 255, 0, 0.3)', x: 680, y: 180 },
    { id: 8, matchName: 'tska_tka', width: 85, height: 95, borderColor: 'cyan', expectedColor: 'rgba(0, 255, 255, 0.3)', x: 380, y: 285 },
    { id: 9, matchName: 'u', width: 85, height: 85, borderColor: 'pink', expectedColor: 'rgba(255, 192, 203, 0.3)', x: 465, y: 70 },
];

const Level7 = ({ navigation }: { navigation: NavigationProp<any> }) => {
    // State to track which word is currently selected
    const [selectedWord, setSelectedWord] = useState<any>(null);
    // State to track matches, where key is the word name and value is the color
    const [matches, setMatches] = useState<Record<string, string>>({});
    const [canContinue, setCanContinue] = useState(false);
    // State to keep track of words that haven't been matched yet
    const [words, setWords] = useState([...draggableElements]);
    
    // Calculate drop zone positions in a circle
    const getCircularDropZones = () => {
        const screenWidth = Dimensions.get('window').width;
        const screenHeight = Dimensions.get('window').height;
        
        // Center of the circle
        const centerX = screenWidth / 2 - 150; // Adjust for the container offset
        const centerY = screenHeight / 2;
        
        // Radius of the circle - make it 35% of the smaller dimension
        const radius = Math.min(screenWidth, screenHeight) * 0.35;
        
        return baseDropZonesData.map((zone, index) => {
            // Calculate angle for this item (in radians)
            const angle = (2 * Math.PI * index) / baseDropZonesData.length;
            
            // Calculate position
            const x = centerX + radius * Math.cos(angle) - zone.width / 2;
            const y = centerY + radius * Math.sin(angle) - zone.height / 2;
            
            return {
                ...zone,
                x, 
                y,
                rotation: '0deg'
            };
        });
    };
    
    // Generate drop zones with circular positions
    //const dropZonesData = getCircularDropZones();
    const dropZonesData = baseDropZonesData;


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

                {/* Drop Zones arrangement */}
                <View style={styles.dropZonesContainer}>
                    {dropZonesData.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                                dropZoneStyles.dropZone,
                                {
                                    left: item.x, // Use x coordinate from baseDropZonesData
                                    top: item.y,  // Use y coordinate from baseDropZonesData
                                    width: item.width,
                                    height: item.height,
                                    transform: [{ rotate: item.rotation || '0deg' }], // Default rotation
                                    borderColor: item.borderColor,
                                    backgroundColor: matches[item.matchName] ? item.expectedColor : 'transparent',
                                },
                            ]}
                            onPress={() => handleDropZonePress(item)}
                            activeOpacity={0.7}
                        />
                    ))}
                </View>


                {/* Words container at the bottom */}
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
        margin: 5, // 10px spacing (5px on each side)
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
    },
    dropZonesContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    wordsContainer: {
        position: 'absolute',
        top: 10,
        left: 150,
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '80%',
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
        width: 90,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedWord: {
        borderWidth: 2,
        borderColor: 'blue',
    },
    wordImage: {
        width: 80,
        height: 20,
        resizeMode: 'contain',
    },
});

export default Level7;