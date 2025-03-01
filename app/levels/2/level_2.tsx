import { LogBox } from 'react-native';
LogBox.ignoreLogs([
    'Draggable: Support for defaultProps will be removed'
]);
import React, { useState, useEffect } from 'react';
import {
    View,
    ImageBackground,
    Image,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Audio } from 'expo-av';
import { NavigationProp } from '@react-navigation/native';
import BackButton from '../../misc/BackButton';
import NextButton from '../../misc/NextButton';

const bgImage = require('@/assets/images/ilustraciones-01.jpg');

const draggableElements = [
    {
        id: 1,
        image: require('@/assets/images/chamulikata2.png'),
        audio: require('@/assets/audios/cahmulikata.wav'),
    },
    {
        id: 2,
        image: require('@/assets/images/i_kule2.png'),
        audio: require('@/assets/audios/ikule.wav'),
    },
    {
        id: 3,
        image: require('@/assets/images/nak_kata2.png'),
        audio: require('@/assets/audios/nakkata.wav'),
    },
    {
        id: 4,
        image: require('@/assets/images/se2.png'),
        audio: require('@/assets/audios/se.wav'),
    },
    {
        id: 5,
        image: require('@/assets/images/tso_klowok2.png'),
        audio: require('@/assets/audios/tsoklowok.wav'),
    },
    {
        id: 6,
        image: require('@/assets/images/tso2.png'),
        audio: require('@/assets/audios/tso.wav'),
    },
    {
        id: 7, // Added a second "se" word with id 7
        image: require('@/assets/images/se2.png'),
        audio: require('@/assets/audios/se.wav'),
    },
];

const dropZonesData = [
    {
        id: 1,
        x: 440,
        y: 365,
        width: 50,
        height: 20,
        rotation: '90deg',
        borderColor: 'pink',
        expectedColor: 'rgba(255, 105, 180, 0.3)', // More reddish pink
    },
    {
        id: 2,
        x: 715,
        y: 70,
        width: 200,
        height: 25,
        rotation: '91deg',
        borderColor: 'green',
        expectedColor: 'rgba(0, 255, 0, 0.3)',
    },
    {
        id: 3,
        x: 520,
        y: 300,
        width: 330,
        height: 30,
        rotation: '-30deg',
        borderColor: 'green',
        expectedColor: 'rgba(0, 255, 0, 0.3)',
    },
    {
        id: 4,
        x: 110,
        y: 200,
        width: 170,
        height: 25,
        rotation: '90deg',
        borderColor: 'red',
        expectedColor: 'rgba(255, 0, 0, 0.3)',
    },
    {
        id: 7, // Added new drop zone for the second "se" word
        x: 210, // Original x (190) + 10
        y: 220, // Original y (270) + 10
        width: 140,
        height: 25,
        rotation: '90deg',
        borderColor: 'magenta', // Different color to distinguish it
        expectedColor: 'rgba(255, 0, 255, 0.3)',
    },
    {
        id: 5,
        x: 120,
        y: 330,
        width: 160,
        height: 25,
        rotation: '20deg',
        borderColor: 'blue',
        expectedColor: 'rgba(0, 0, 255, 0.3)',
    },
    {
        id: 6,
        x: 200,
        y: 80,
        width: 120,
        height: 25,
        rotation: '-27deg',
        borderColor: 'yellow',
        expectedColor: 'rgba(255, 255, 0, 0.3)',
    },
];

const Level2 = ({ navigation }: { navigation: NavigationProp<any> }) => {
    // Use a state copy for words that haven't been matched yet.
    const [words, setWords] = useState([...draggableElements]);
    const [selectedWord, setSelectedWord] = useState<any>(null);
    // Matches: key is the drop zone id, value is the expected color.
    const [matches, setMatches] = useState<Record<number, string>>({});
    const [canContinue, setCanContinue] = useState(false);

    // Play audio for the given asset.
    const playSound = async (audio: any) => {
        const { sound } = await Audio.Sound.createAsync(audio);
        await sound.playAsync();
    };

    // When a word is tapped, toggle its selection (unless already matched).
    const handleWordPress = (word: any) => {
        if (matches[word.id]) return; // Already matched.
        if (selectedWord && selectedWord.id === word.id) {
            setSelectedWord(null);
        } else {
            setSelectedWord(word);
        }
    };

    // When a drop zone is tapped, check for a match.
    const handleDropZonePress = (zone: { id: number; expectedColor: string }) => {
        if (!selectedWord) return;
        if (selectedWord.id === zone.id) {
            setMatches((prev) => ({ ...prev, [zone.id]: zone.expectedColor }));
            playSound(selectedWord.audio);
            setWords((prev) => prev.filter((word) => word.id !== selectedWord.id));
        }
        setSelectedWord(null);
    };

    // When all words have been matched, enable Next.
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

                {/* Render drop zones as clickable areas. They start off transparent */}
                {dropZonesData.map((zone) => (
                    <TouchableOpacity
                        key={zone.id}
                        style={[
                            dropZoneStyles.dropZone,
                            {
                                left: zone.x,
                                top: zone.y,
                                width: zone.width,
                                height: zone.height,
                                transform: [{ rotate: zone.rotation }],
                                borderColor: zone.borderColor,
                                backgroundColor: matches[zone.id] ? matches[zone.id] : 'transparent',
                            },
                        ]}
                        onPress={() => handleDropZonePress(zone)}
                        activeOpacity={0.7}
                    >
                        {/* Optionally add a label here */}
                        <Text style={dropZoneStyles.label}></Text>
                    </TouchableOpacity>
                ))}

              {/* Render words (as images) in a wrapped container */}
              <View style={styles.wordsContainer}>
                    {words.map((word) => (
                        <TouchableOpacity
                            key={word.id}
                            style={[
                                styles.wordButton,
                                selectedWord && selectedWord.id === word.id && styles.selectedWord,
                                // If this word is matched, fill it with the drop zone's color.
                                matches[word.id] && { backgroundColor: matches[word.id] },
                            ]}
                            onPress={() => handleWordPress(word)}
                        >
                            <Image source={word.image} style={styles.wordImage} />
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
        borderWidth: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        resizeMode: 'cover',
    },
    wordsContainer: {
        position: 'absolute',
        top: 10,
        flexDirection: 'row',
        flexWrap: 'wrap', // Allow words to wrap to the next line
        width: '90%',
        paddingVertical: 10,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    wordButton: {
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 10,
        padding: 2,
        margin: 5, // Adjust margin for better spacing
    },
    selectedWord: {
        borderWidth: 2,
        borderColor: 'blue',
    },
    wordImage: {
        width: 120, // Reduced width
        height: 40, // Increased height
        resizeMode: 'cover',
    },
});

export default Level2;