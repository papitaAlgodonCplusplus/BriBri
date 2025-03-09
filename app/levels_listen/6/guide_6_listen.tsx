import React, { useState, useEffect } from 'react';
import { View, ImageBackground, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import { Audio } from 'expo-av';
import BackButton from '@/app/misc/BackButton';
import NextButton from '@/app/misc/NextButton';

const Guide6Listen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const bgImage = require('@/assets/images/ilustraciones-04.jpg');

  const [mode, setMode] = useState<'read' | 'listen' | null>(null);

  useEffect(() => {
    const fetchMode = async () => {
      const storedMode = await AsyncStorage.getItem('mode');
      setMode(storedMode === 'read' || storedMode === 'listen' ? storedMode : 'listen');
    };
    fetchMode();
  }, []);

  // These correspond to the level 6 draggable elements
  const draggableElements = [
    { id: 1, name: 'ukko', audio: require('@/assets/audios/ukko.wav') },
    { id: 2, name: 'ushu', audio: require('@/assets/audios/ushu.wav') },
    { id: 3, name: 'akwawe', audio: require('@/assets/audios/ak_wawe.wav') },
    { id: 4, name: 'ulok', audio: require('@/assets/audios/ulok.wav') },
    { id: 5, name: 'iwo', audio: require('@/assets/audios/iwo.wav') },
    { id: 6, name: 'ko', audio: require('@/assets/audios/ko.wav') },
    { id: 7, name: 'kapokua', audio: require('@/assets/audios/kapokua.wav') },
  ];

  // Define audio box styles based on the drop zones from level 6
  const dropZoneStyles = StyleSheet.create({
    zoneContainer1: {
      position: 'absolute',
      left: 400,
      top: 270,
      width: 150,
      height: 80,
      transform: [{ rotate: '0deg' }],
      borderColor: 'purple',
      backgroundColor: 'rgba(128, 0, 128, 0.3)',
      borderWidth: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
    zoneContainer2: {
      position: 'absolute',
      left: 630,
      top: 40,
      width: 60,
      height: 50,
      transform: [{ rotate: '0deg' }],
      borderColor: 'red',
      backgroundColor: 'rgba(255, 0, 0, 0.3)',
      borderWidth: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
    zoneContainer3: {
      position: 'absolute',
      left: 120,
      top: 30,
      width: 80,
      height: 60,
      transform: [{ rotate: '0deg' }],
      borderColor: 'blue',
      backgroundColor: 'rgba(0, 0, 255, 0.3)',
      borderWidth: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
    zoneContainer4: {
      position: 'absolute',
      left: 385,
      top: 10,
      width: 25,
      height: 60,
      transform: [{ rotate: '0deg' }],
      borderColor: 'green',
      backgroundColor: 'rgba(0, 128, 0, 0.3)',
      borderWidth: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
    zoneContainer5: {
      position: 'absolute',
      left: 170,
      top: 60,
      width: 40,
      height: 30,
      transform: [{ rotate: '0deg' }],
      borderColor: 'red',
      backgroundColor: 'rgba(255, 0, 0, 0.3)',
      borderWidth: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
    zoneContainer6: {
      position: 'absolute',
      left: 470,
      top: 10,
      width: 40,
      height: 50,
      transform: [{ rotate: '0deg' }],
      borderColor: 'orange',
      backgroundColor: 'rgba(255, 165, 0, 0.3)',
      borderWidth: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
    zoneContainer7: {
      position: 'absolute',
      left: 600,
      top: 180,
      width: 100,
      height: 25,
      transform: [{ rotate: '-20deg' }],
      borderColor: 'yellow',
      backgroundColor: 'rgba(255, 255, 0, 0.3)',
      borderWidth: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  // Map audio boxes to the correct ids
  const audioBoxesData = [
    { id: 1, name: 'ukko', style: dropZoneStyles.zoneContainer1 },
    { id: 2, name: 'ushu', style: dropZoneStyles.zoneContainer2 },
    { id: 3, name: 'akwawe', style: dropZoneStyles.zoneContainer3 },
    { id: 4, name: 'ulok', style: dropZoneStyles.zoneContainer4 },
    { id: 5, name: 'iwo', style: dropZoneStyles.zoneContainer5 },
    { id: 6, name: 'ko', style: dropZoneStyles.zoneContainer6 },
    { id: 7, name: 'kapokua', style: dropZoneStyles.zoneContainer7 },
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
          <TouchableOpacity
            key={box.id}
            style={box.style}
            onPress={() => handleAudioBoxPress(box.id)}
          >
            <Image source={require('@/assets/images/audio.png')} style={styles.audioIcon} />
          </TouchableOpacity>
        ))}
      </View>
      <NextButton navigation={navigation} nextName="Level6Listen" />
    </View>
  );
};

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    resizeMode: 'stretch',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
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

export default Guide6Listen;