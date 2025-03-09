import React, { useState, useEffect } from 'react';
import { View, ImageBackground, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import { Audio } from 'expo-av';
import BackButton from '@/app/misc/BackButton';
import NextButton from '@/app/misc/NextButton';

const Guide7Listen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const bgImage = require('@/assets/images/ilustraciones-05.jpg');

  const [mode, setMode] = useState<'read' | 'listen' | null>(null);

  useEffect(() => {
    const fetchMode = async () => {
      const storedMode = await AsyncStorage.getItem('mode');
      setMode(storedMode === 'read' || storedMode === 'listen' ? storedMode : 'listen');
    };
    fetchMode();
  }, []);

  // These correspond to the level 7 draggable elements
  const draggableElements = [
    { id: 1, name: 'aiko_ko', audio: require('@/assets/audios/ko.wav') },
    { id: 2, name: 'kula', audio: require('@/assets/audios/kula.wav') },
    { id: 3, name: 'kule', audio: require('@/assets/audios/kule.wav') },
    { id: 4, name: 'sabak_dule', audio: require('@/assets/audios/sabak_dule.wav') },
    { id: 5, name: 'sku', audio: require('@/assets/audios/sku.wav') },
    { id: 7, name: 'to_ta', audio: require('@/assets/audios/to.wav') },
    { id: 8, name: 'tska_tka', audio: require('@/assets/audios/tska.wav') },
    { id: 9, name: 'u', audio: require('@/assets/audios/u.wav') },
  ];

  // Define audio box styles based on the drop zones from level 7
  const dropZoneStyles = StyleSheet.create({
    zoneContainer1: {
      position: 'absolute',
      left: 300, 
      top: 300,
      width: 80,
      height: 80,
      borderColor: 'red',
      backgroundColor: 'rgba(255, 0, 0, 0.3)',
      borderWidth: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
    zoneContainer2: {
      position: 'absolute',
      left: 675,
      top: 280,
      width: 105,
      height: 95,
      borderColor: 'blue',
      backgroundColor: 'rgba(0, 0, 255, 0.3)',
      borderWidth: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
    zoneContainer3: {
      position: 'absolute',
      left: 548,
      top: 290,
      width: 125,
      height: 90,
      borderColor: 'green',
      backgroundColor: 'rgba(0, 255, 0, 0.3)',
      borderWidth: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
    zoneContainer4: {
      position: 'absolute',
      left: 465,
      top: 270,
      width: 80,
      height: 110,
      borderColor: 'orange',
      backgroundColor: 'rgba(255, 165, 0, 0.3)',
      borderWidth: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
    zoneContainer5: {
      position: 'absolute',
      left: 584,
      top: 89,
      width: 90,
      height: 95,
      borderColor: 'purple',
      backgroundColor: 'rgba(128, 0, 128, 0.3)',
      borderWidth: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
    zoneContainer7: {
      position: 'absolute',
      left: 680,
      top: 180,
      width: 90,
      height: 80,
      borderColor: 'yellow',
      backgroundColor: 'rgba(255, 255, 0, 0.3)',
      borderWidth: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
    zoneContainer8: {
      position: 'absolute',
      left: 380,
      top: 285,
      width: 85,
      height: 95,
      borderColor: 'cyan',
      backgroundColor: 'rgba(0, 255, 255, 0.3)',
      borderWidth: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
    zoneContainer9: {
      position: 'absolute',
      left: 465,
      top: 70,
      width: 85,
      height: 85,
      borderColor: 'pink',
      backgroundColor: 'rgba(255, 192, 203, 0.3)',
      borderWidth: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  // Map audio boxes to the correct ids
  const audioBoxesData = [
    { id: 1, name: 'aiko_ko', style: dropZoneStyles.zoneContainer1 },
    { id: 2, name: 'kula', style: dropZoneStyles.zoneContainer2 },
    { id: 3, name: 'kule', style: dropZoneStyles.zoneContainer3 },
    { id: 4, name: 'sabak_dule', style: dropZoneStyles.zoneContainer4 },
    { id: 5, name: 'sku', style: dropZoneStyles.zoneContainer5 },
    { id: 7, name: 'to_ta', style: dropZoneStyles.zoneContainer7 },
    { id: 8, name: 'tska_tka', style: dropZoneStyles.zoneContainer8 },
    { id: 9, name: 'u', style: dropZoneStyles.zoneContainer9 },
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
      <NextButton navigation={navigation} nextName="Level7Listen" />
    </View>
  );
};

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    resizeMode: 'stretch',
    justifyContent: 'center',
    width: '120%',
    height: '100%',
    left: -10,
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

export default Guide7Listen;