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

const bgImage = require('@/assets/images/guia1juego.png');

// Updated draggable elements with a "name" property for matching.
const draggableElements = [
    {
        id: 2,
        name: 'nolo kibi', // should match the drop zone that expects "nolo kibi"
        image: require('@/assets/images/nolo_kibi.png'),
        audio: require('@/assets/audios/nolo_kibi_camino_antes_de_la_casa.wav'),
    },
    {
        id: 3,
        name: 'ale', // drop zone expects "ale"
        image: require('@/assets/images/ale.png'),
        audio: require('@/assets/audios/ale_alero.wav'),
    },
    {
        id: 1,
        name: 'nolo nkuo', // drop zone expects "nolo nkuo"
        image: require('@/assets/images/nolo_nkuo.png'),
        audio: require('@/assets/audios/nolo_nkuo_caminito_de_la_casa.wav'),
    },
    {
        id: 4,
        name: 'kapo', // drop zone expects "kapo"
        image: require('@/assets/images/kapo.png'),
        audio: require('@/assets/audios/kapo_hamaca.wav'),
    },
];

// Define drop zones with the exact name they should match, and the expected color.
const dropZonesData = [
    {
        matchName: 'kapo',
        expectedColor: 'orange',
    },
    {
        matchName: 'nolo kibi',
        expectedColor: 'green',
    },
    {
        matchName: 'nolo nkuo',
        expectedColor: 'yellow',
    },
    {
        matchName: 'ale',
        expectedColor: 'red',
    },
];

const Level1 = ({ navigation }: { navigation: NavigationProp<any> }) => {
    // State to keep track of the selected word.
    const [selectedWord, setSelectedWord] = useState<any>(null);
    // Record of matches where key is the word's name and value is the assigned color.
    const [matches, setMatches] = useState<Record<string, string>>({});
    const [canContinue, setCanContinue] = useState(false);

    // Play sound function remains unchanged.
    const playSound = async (audio: any) => {
        const { sound } = await Audio.Sound.createAsync(audio);
        await sound.playAsync();
    };

    // Handle word selection. If the word is already matched, ignore it.
    const handleWordPress = (item: any) => {
        if (matches[item.name]) return; // Already matched.
        if (selectedWord && selectedWord.name === item.name) {
            setSelectedWord(null);
        } else {
            setSelectedWord(item);
        }
    };

    // Handle drop zone press. Check if the selected word's name matches the drop zone's expected name.
    const handleDropZonePress = (zoneItem: { matchName: string; expectedColor: string }) => {
        if (!selectedWord) return;
        console.log('Selected word:', selectedWord.name, 'Expected:', zoneItem.matchName);
        if (selectedWord.name === zoneItem.matchName) {
            setMatches((prev) => ({ ...prev, [zoneItem.matchName]: zoneItem.expectedColor }));
            playSound(selectedWord.audio);
        }
        setSelectedWord(null);
    };

    // Enable "Next" button when all matches are made.
    useEffect(() => {
        if (Object.keys(matches).length === dropZonesData.length) {
            setCanContinue(true);
        }
    }, [matches]);

    return (
        <View style={{ flex: 1 }}>
            <ImageBackground source={bgImage} style={styles.bgImage}>
            </ImageBackground>

            {/* Back Button */}
            <BackButton navigation={navigation} />

            {/* Next Button – only shown once all matches have been made */}
            {canContinue && <NextButton navigation={navigation} nextName="LevelMapping" />}

            {/* Words container – the clickable words (represented here by images) */}
            <View style={styles.wordsContainer}>
                {draggableElements.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[
                            styles.wordButton,
                            selectedWord && selectedWord.name === item.name && styles.selectedWord,
                            // If matched, show its assigned background color.
                            matches[item.name] && { backgroundColor: matches[item.name] },
                        ]}
                        onPress={() => handleWordPress(item)}
                        disabled={!!matches[item.name]} // Disable clicks on matched words.
                    >
                        <Image source={item.image} style={{ width: 130, height: 50 }} />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Drop zones container – the clickable boxes */}
            <View style={styles.dropZonesContainer}>
                {dropZonesData.map((zone, index) => (
                    <TouchableOpacity
                        key={zone.matchName}
                        style={[
                            dropZoneStyles[`zoneContainer${index + 1}`],
                            // If matched, fill the box with its assigned color.
                            matches[zone.matchName] && { backgroundColor: matches[zone.matchName] },
                        ]}
                        onPress={() => handleDropZonePress(zone)}
                    >
                        {/* You can optionally place a label here if needed */}
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const dropZoneStyles = StyleSheet.create({
    // Order here: zoneContainer1 expects "nolo kibi" (orange), zoneContainer2 expects "ale" (green),
    // zoneContainer3 expects "nolo nkuo" (yellow), zoneContainer4 expects "kapo" (red).
    zoneContainer1: {
        width: 145, // reduced size in half
        height: 45, // reduced size in half
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        left: 380, // adjusted from 580, -50
        top: -155, // adjusted from -60, -100
        borderColor: 'orange',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 4,
    },
    zoneContainer2: {
        width: 200, // reduced size in half
        height: 40, // reduced size in half
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        left: -180, // adjusted from -280, -50
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        top: -70, // adjusted from 80, -100
        transform: [{ rotate: '20deg' }],
        borderColor: 'green',
        borderWidth: 4,
    },
    zoneContainer3: {
        width: 60, // reduced size in half
        height: 25, // reduced size in half
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        left: -335, // adjusted from -430, -50
        top: -90, // adjusted from 45, -100
        borderColor: 'yellow',
        borderWidth: 4,
    },
    zoneContainer4: {
        width: 80, // reduced size in half
        height: 60, // reduced size in half
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        left: -420, // adjusted from -430, -50
        top: -250, // adjusted from -120, -100
        borderColor: 'red',
        borderWidth: 4,
    },
} as Record<string, any>);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    wordsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        top: 340,
        zIndex: 3,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        paddingVertical: 10,
        position: 'absolute',
    },
    wordButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 10,
        padding: 10,
        width: 200,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    selectedWord: {
        borderWidth: 2,
        borderColor: 'blue',
    },
    dropZonesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
    },
    bgImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        width: '115%',
        height: '140%',
        left: 18,
        top: -100,
    },
});

export default Level1;
