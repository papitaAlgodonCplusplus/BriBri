import React, { useState, useEffect } from 'react';
import { View, ImageBackground, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import { Audio } from 'expo-av';
import BackButton from '@/app/misc/BackButton';
import NextButton from '@/app/misc/NextButton';

const GuideListen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  // Use the same background image as before.
  const bgImage = require('@/assets/images/guia1.png');

  const [mode, setMode] = useState<'read' | 'listen' | null>(null);

  useEffect(() => {
    const fetchMode = async () => {
      const storedMode = await AsyncStorage.getItem('mode');
      setMode(storedMode === 'read' || storedMode === 'listen' ? storedMode : 'listen');
    };
    fetchMode();
  }, []);

  // Draggable elements are used here only to retrieve the audio files.
  const draggableElements = [
    {
      name: 'nolo nkuo',
      audio: require('@/assets/audios/nolo_kibi_camino_antes_de_la_casa.wav'),
    },
    {
      name: 'nolo kibi',
      audio: require('@/assets/audios/nolo_nkuo_caminito_de_la_casa.wav'),
    },
    {
      name: 'ale',
      audio: require('@/assets/audios/ale_alero.wav'),
    },
    {
      name: 'kapo',
      audio: require('@/assets/audios/kapo_hamaca.wav'),
    },
  ];

  // Define drop zone styles (these are used to position the audio boxes).
  // The colors are as follows:
  //   zoneContainer1 (orange)  -> for kapo
  //   zoneContainer2 (green)   -> for nolo kibi
  //   zoneContainer3 (yellow)  -> for nolo nkuo
  //   zoneContainer4 (red)     -> for ale
  const dropZoneStyles = StyleSheet.create({
    zoneContainer1: {
      width: 145,
      height: 45,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 10,
      left: 110 + 300,
      top: 150 + 80,
      borderColor: 'orange',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      borderWidth: 4,
    },
    zoneContainer2: {
      width: 60,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 10,
      left: -80 + 320,
      top: 170 + 80,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      transform: [{ rotate: '-20deg' }],
      borderColor: 'green',
      borderWidth: 4,
    },
    zoneContainer3: {
      width: 300,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      left: -230 + 300,
      top: 170 + 80,
      transform: [{ rotate: '30deg' }],
      borderColor: 'yellow',
      borderWidth: 4,
    },
    zoneContainer4: {
      width: 80,
      height: 60,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 10,
      left: 20 + 300,
      top: -70 + 80,
      borderColor: 'red',
      borderWidth: 4,
    },
  } as Record<string, any>);

  // Map the audio boxes with the desired mapping:
  //   - Orange box (zoneContainer1) for kapo
  //   - Green box (zoneContainer2) for nolo kibi
  //   - Yellow box (zoneContainer3) for nolo nkuo
  //   - Red box (zoneContainer4) for ale
  const audioBoxesData = [
    { name: 'kapo', style: dropZoneStyles.zoneContainer1 },
    { name: 'nolo kibi', style: dropZoneStyles.zoneContainer2 },
    { name: 'nolo nkuo', style: dropZoneStyles.zoneContainer3 },
    { name: 'ale', style: dropZoneStyles.zoneContainer4 },
  ];

  // Function to play audio.
  const playSound = async (audio: any) => {
    try {
      const { sound } = await Audio.Sound.createAsync(audio);
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing sound', error);
    }
  };

  // When an audio box is pressed, find its audio file and play it.
  const handleAudioBoxPress = (name: string) => {
    const element = draggableElements.find(e => e.name === name);
    if (element) {
      playSound(element.audio);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <ImageBackground source={bgImage} style={styles.bgImage} />
      <BackButton navigation={navigation} />
      {/* Audio boxes container overlays the background */}
      <View style={styles.audioBoxesContainer}>
        {audioBoxesData.map((box) => (
          <TouchableOpacity
            key={box.name}
            style={box.style}
            onPress={() => handleAudioBoxPress(box.name)}
          >
            <Image source={require('@/assets/images/audio.png')} style={styles.audioIcon} />
          </TouchableOpacity>
        ))}
      </View>
      {/* Next button navigates to the Level1Listen screen */}
      <NextButton navigation={navigation} nextName="Level1Listen" />
    </View>
  );
};

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    width: '115%',
    height: '123%',
    top: -90,
    left: 17,
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

export default GuideListen;
