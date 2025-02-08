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

const bgImage = require('@/assets/images/pantalla_sin_elementos.jpg');

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
];

const dropZonesData = [
    {
        id: 1,
        x: 345,
        y: 225,
        width: 120,
        height: 30,
        rotation: '20deg',
        borderColor: 'red',
        expectedColor: 'rgba(255, 0, 0, 0.3)',
    },
    {
        id: 2,
        x: 350,
        y: 130,
        width: 350,
        height: 25,
        rotation: '-15deg',
        borderColor: 'blue',
        expectedColor: 'rgba(0, 0, 255, 0.3)',
    },
    {
        id: 3,
        x: 445,
        y: 155,
        width: 330,
        height: 30,
        rotation: '-30deg',
        borderColor: 'green',
        expectedColor: 'rgba(0, 255, 0, 0.3)',
    },
    {
        id: 4,
        x: 190,
        y: 270,
        width: 170,
        height: 25,
        rotation: '90deg',
        borderColor: 'purple',
        expectedColor: 'rgba(128, 0, 128, 0.3)',
    },
    {
        id: 5,
        x: 270,
        y: 300,
        width: 160,
        height: 25,
        rotation: '90deg',
        borderColor: 'orange',
        expectedColor: 'rgba(255, 165, 0, 0.3)',
    },
    {
        id: 6,
        x: 350,
        y: 90,
        width: 320,
        height: 25,
        rotation: '-27deg',
        borderColor: 'pink',
        expectedColor: 'rgba(255, 192, 203, 0.3)',
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

                {/* Render words (as images) in a horizontal scroll */}
                <ScrollView horizontal style={styles.wordsContainer}>
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
                </ScrollView>
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
        bottom: 20,
        flexDirection: 'row',
        width: '100%',
        paddingVertical: 10,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    wordButton: {
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 10,
        padding: 5,
        marginHorizontal: 10,
    },
    selectedWord: {
        borderWidth: 2,
        borderColor: 'blue',
    },
    wordImage: {
        width: 110,
        height: 40,
        resizeMode: 'cover',
    },
});

export default Level2;
