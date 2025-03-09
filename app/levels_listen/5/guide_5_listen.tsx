import React, { useState, useEffect } from 'react';
import { View, ImageBackground, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import { Audio } from 'expo-av';
import BackButton from '@/app/misc/BackButton';
import NextButton from '@/app/misc/NextButton';

const Guide5Listen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const bgImage = require('@/assets/images/ilustraciones-30.jpg');

  const [mode, setMode] = useState<'read' | 'listen' | null>(null);

  useEffect(() => {
    const fetchMode = async () => {
      const storedMode = await AsyncStorage.getItem('mode');
      setMode(storedMode === 'read' || storedMode === 'listen' ? storedMode : 'listen');
    };
    fetchMode();
  }, []);

  // These correspond to the level 5 draggable elements
  const draggableElements = [
    { id: 1, name: 'chane', audio: require('@/assets/audios/chane.wav') },
    { id: 2, name: 'kowolo', audio: require('@/assets/audios/kowolo.wav') },
    { id: 3, name: 'koklowok', audio: require('@/assets/audios/ko_klowok.wav') },
    { id: 4, name: 'tska', audio: require('@/assets/audios/tska.wav') },
  ];

  // Define audio box styles based on the drop zones from level 5
  const dropZoneStyles = StyleSheet.create({
    zoneContainer1: {
      position: 'absolute',
      left: 480,
      top: 39,
      width: 60,
      height: 50,
      transform: [{ rotate: '-68deg' }],
      borderColor: 'yellow',
      backgroundColor: 'rgba(255, 255, 0, 0.3)',
      borderWidth: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
    zoneContainer2: {
      position: 'absolute',
      left: 590,
      top: 180,
      width: 60,
      height: 80,
      transform: [{ rotate: '0deg' }],
      borderColor: 'green',
      backgroundColor: 'rgba(0, 255, 0, 0.3)',
      borderWidth: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
    zoneContainer3: {
      position: 'absolute',
      left: 570,
      top: 100,
      width: 90,
      height: 40,
      transform: [{ rotate: '-90deg' }],
      borderColor: 'red',
      backgroundColor: 'rgba(255, 0, 0, 0.3)',
      borderWidth: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
    zoneContainer4: {
      position: 'absolute',
      left: 630,
      top: 300,
      width: 50,
      height: 100,
      transform: [{ rotate: '-40deg' }],
      borderColor: 'purple',
      backgroundColor: 'rgba(128, 0, 128, 0.3)',
      borderWidth: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  // Map audio boxes to the correct ids
  const audioBoxesData = [
    { id: 2, name: 'kowolo', style: dropZoneStyles.zoneContainer1 },
    { id: 1, name: 'chane', style: dropZoneStyles.zoneContainer2 },
    { id: 3, name: 'koklowok', style: dropZoneStyles.zoneContainer3 },
    { id: 4, name: 'tska', style: dropZoneStyles.zoneContainer4 },
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
      <NextButton navigation={navigation} nextName="Level5Listen" />
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

export default Guide5Listen;