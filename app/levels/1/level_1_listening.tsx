import React, { useState, useEffect } from 'react';
import { ImageBackground, View, Image, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import { Audio } from 'expo-av';
import NextButton from '@/app/misc/NextButton';
import BackButton from '@/app/misc/BackButton';

const playIcon = require('@/assets/images/play.png');
const bgImage = require('@/assets/images/lv_1_bg.png');

interface GuideElement {
    id: number;
    image: any;
    audio: any;
}

const originalGuideElements: GuideElement[] = [
    {
        id: 1,
        image: require('@/assets/images/hamaca.png'),
        audio: require('@/assets/audios/nolo_nkuo_caminito_de_la_casa.wav'),
    },
    {
        id: 2,
        image: require('@/assets/images/techo_frente.png'),
        audio: require('@/assets/audios/nolo_kibi_camino_antes_de_la_casa.wav'),
    },
    {
        id: 3,
        image: require('@/assets/images/camino.png'),
        audio: require('@/assets/audios/kapo_hamaca.wav'),
    },
    {
        id: 4,
        image: require('@/assets/images/entrada.png'),
        audio: require('@/assets/audios/ale_alero.wav'),
    },
];

interface Level1ListeningProps {
    navigation: any;
}

const shuffleArray = (array: any[]) => {
    return array
        .map((item) => ({ ...item, sortKey: Math.random() }))
        .sort((a, b) => a.sortKey - b.sortKey)
        .map(({ sortKey, ...item }) => item);
};

const Level1Listening: React.FC<Level1ListeningProps> = ({ navigation }) => {
    const [shuffledAudios, setShuffledAudios] = useState<GuideElement[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [points, setPoints] = useState<number>(0);
    const [disabledIds, setDisabledIds] = useState<number[]>([]);
    const [canContinue, setCanContinue] = useState<boolean>(false);

    useEffect(() => {
        setShuffledAudios(shuffleArray(originalGuideElements));
    }, []);

    const playSound = async (): Promise<void> => {
        if (shuffledAudios.length > 0) {
            const { sound } = await Audio.Sound.createAsync(shuffledAudios[currentIndex].audio);
            await sound.playAsync();
        }
    };

    const handleImagePress = (selectedId: number): void => {
        if (selectedId === shuffledAudios[currentIndex].id) {
            setPoints(points + 1);
            setDisabledIds([]);

            if (currentIndex === shuffledAudios.length - 1) {
                setCanContinue(true);
            } else {
                setCurrentIndex(currentIndex + 1);
            }
        } else {
            setDisabledIds((prev) => [...prev, selectedId]);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
            <ImageBackground source={bgImage} style={styles.container} imageStyle={{ opacity: 0.3 }} />

            {/* Back Button */}
            <BackButton navigation={navigation} />
                        
            {/* Next Button */}
            {canContinue && <NextButton navigation={navigation} nextName="LevelMapping" />}

            <Text style={styles.title}>Asocia Audio-Imagen</Text>
            <TouchableOpacity onPress={playSound} style={styles.playButton}>
                <Image source={playIcon} style={styles.playIcon} />
                <Text style={styles.playText}>Escuchar</Text>
            </TouchableOpacity>

            <View style={styles.optionsContainer}>
                {originalGuideElements.map((element) => (
                    <TouchableOpacity
                        key={element.id}
                        onPress={() => handleImagePress(element.id)}
                        style={[
                            styles.option,
                            disabledIds.includes(element.id) ? styles.disabledOption : null,
                            disabledIds.includes(element.id) ? styles.incorrect : null,
                        ]}
                        disabled={disabledIds.includes(element.id)}
                    >
                        <Image source={element.image} style={styles.optionImage} />
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>Puntaje: {points}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: 'bold',
        marginBottom: 20,
        position: 'absolute',
        top: 20,
        left: 300,
    },
    playButton: {
        top: 80,
        left: 340,
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(41, 227, 149, 0.44)',
        padding: 15,
        borderRadius: 10,
        marginBottom: 30,
    },
    playIcon: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    playText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    optionsContainer: {
        bottom: 20,
        left: 170,
        position: 'absolute',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 20,
    },
    option: {
        width: 100,
        height: 100,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    disabledOption: {
        opacity: 0.5,
    },
    incorrect: {
        borderColor: 'red',
        borderWidth: 2,
        borderRadius: 60,
    },
});

export default Level1Listening;
