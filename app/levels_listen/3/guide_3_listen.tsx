import React, { useState, useEffect } from 'react';
import { View, ImageBackground, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import { Audio } from 'expo-av';
import BackButton from '@/app/misc/BackButton';
import NextButton from '@/app/misc/NextButton';

const Guide3Listen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const bgImage = require('@/assets/images/guia3.png');

  const [mode, setMode] = useState<'read' | 'listen' | null>(null);

  useEffect(() => {
    const fetchMode = async () => {
      const storedMode = await AsyncStorage.getItem('mode');
      setMode(storedMode === 'read' || storedMode === 'listen' ? storedMode : 'listen');
    };
    fetchMode();
  }, []);

  // Only audio is needed for the listen mode.
  // These correspond to the level 3 draggable elements.
  const draggableElements = [
    { id: 1, audio: require('@/assets/audios/utto.wav') },
    { id: 2, audio: require('@/assets/audios/uko.wav') },
    { id: 3, audio: require('@/assets/audios/etsok.wav') },
    { id: 4, audio: require('@/assets/audios/utsi.wav') },
  ];

  // Define audio box styles exactly as the drop zones defined in Level3 (read mode)
  const dropZoneStyles = StyleSheet.create({
    zoneContainer1: {
      position: 'absolute',
      left: 150,
      top: 240,
      width: 130,
      height: 80,
      transform: [{ rotate: '-60deg' }],
      borderColor: 'red',
      backgroundColor: 'rgba(255, 0, 0, 0.3)',
      borderWidth: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
    zoneContainer3: {
      position: 'absolute',
      left: 210,
      top: 100,
      width: 420,
      height: 45,
      transform: [{ rotate: '-20deg' }],
      borderColor: 'green',
      backgroundColor: 'rgba(0, 255, 0, 0.3)',
      borderWidth: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
    zoneContainer4: {
      position: 'absolute',
      left: 430,
      top: 10,
      width: 200,
      height: 450,
      transform: [{ rotate: '70deg' }],
      borderColor: 'purple',
      backgroundColor: 'rgba(128, 0, 128, 0.3)',
      borderWidth: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  // Use the same mapping as the drop zones
  const audioBoxesData = [
    { id: 1, style: dropZoneStyles.zoneContainer1 },
    { id: 3, style: dropZoneStyles.zoneContainer3 },
    { id: 4, style: dropZoneStyles.zoneContainer4 },
  ];

  const playSound = async (audio: any) => {
    try {
      const { sound } = await Audio.Sound.createAsync(audio);
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing sound', error);
    }
  };

  const handleAudioBoxPress = (id: number) => {
    const element = draggableElements.find(e => e.id === id);
    if (element) {
      playSound(element.audio);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <ImageBackground source={bgImage} style={styles.bgImage} />
      <BackButton navigation={navigation} />
      <View style={styles.audioBoxesContainer}>
        {audioBoxesData.map(box => (
          <TouchableOpacity key={box.id} style={box.style} onPress={() => handleAudioBoxPress(box.id)}>
            <Image source={require('@/assets/images/audio.png')} style={styles.audioIcon} />
          </TouchableOpacity>
        ))}
      </View>
      <NextButton navigation={navigation} nextName="Level3Listen" />
    </View>
  );
};

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    resizeMode: 'stretch',
    justifyContent: 'center',
    width: '115%',
    height: '115%',
    top: -120,
    left: -40,
  },
  audioBoxesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  audioIcon: {
    width: 30,
    height: 30,
  },
});

export default Guide3Listen;
