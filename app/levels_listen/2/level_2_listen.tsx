import { LogBox } from 'react-native';
LogBox.ignoreLogs([
  'Draggable: Support for defaultProps will be removed'
]);
import React, { useState, useEffect } from 'react';
import { View, ImageBackground, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Audio } from 'expo-av';
import { NavigationProp } from '@react-navigation/native';
import BackButton from '../../misc/BackButton';
import NextButton from '../../misc/NextButton';

const bgImage = require('@/assets/images/pantalla_sin_elementos.jpg');

// Draggable elements for listening—only the audio is needed.
const draggableElements = [
  { id: 1, audio: require('@/assets/audios/cahmulikata.wav') },
  { id: 2, audio: require('@/assets/audios/ikule.wav') },
  { id: 3, audio: require('@/assets/audios/nakkata.wav') },
  { id: 4, audio: require('@/assets/audios/se.wav') },
  { id: 5, audio: require('@/assets/audios/tsoklowok.wav') },
  { id: 6, audio: require('@/assets/audios/tso.wav') },
];

const dropZonesData = [
  { id: 1, x: 345, y: 225, width: 120, height: 30, rotation: '20deg', borderColor: 'red', expectedColor: 'rgba(255, 0, 0, 0.3)' },
  { id: 2, x: 350, y: 130, width: 350, height: 25, rotation: '-15deg', borderColor: 'blue', expectedColor: 'rgba(0, 0, 255, 0.3)' },
  { id: 3, x: 445, y: 155, width: 330, height: 30, rotation: '-30deg', borderColor: 'green', expectedColor: 'rgba(0, 255, 0, 0.3)' },
  { id: 4, x: 190, y: 270, width: 170, height: 25, rotation: '90deg', borderColor: 'purple', expectedColor: 'rgba(128, 0, 128, 0.3)' },
  { id: 5, x: 270, y: 300, width: 160, height: 25, rotation: '90deg', borderColor: 'orange', expectedColor: 'rgba(255, 165, 0, 0.3)' },
  { id: 6, x: 350, y: 90, width: 320, height: 25, rotation: '-27deg', borderColor: 'pink', expectedColor: 'rgba(255, 192, 203, 0.3)' },
];

const Level2Listen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [selectedAudio, setSelectedAudio] = useState<any>(null);
  const [matches, setMatches] = useState<Record<number, string>>({});
  const [canContinue, setCanContinue] = useState(false);

  const playSound = async (audio: any) => {
    try {
      const { sound } = await Audio.Sound.createAsync(audio);
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing sound', error);
    }
  };

  const handleAudioPress = (item: any) => {
    if (matches[item.id]) return;
    setSelectedAudio(item);
    playSound(item.audio);
  };

  const handleDropZonePress = (zone: { id: number; expectedColor: string }) => {
    if (!selectedAudio) return;
    if (selectedAudio.id === zone.id) {
      setMatches(prev => ({ ...prev, [zone.id]: zone.expectedColor }));
    }
    setSelectedAudio(null);
  };

  useEffect(() => {
    if (Object.keys(matches).length === draggableElements.length) {
      setCanContinue(true);
    }
  }, [matches]);

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={bgImage} style={styles.bgImage} />
      <BackButton navigation={navigation} />
      {canContinue && <NextButton navigation={navigation} nextName="LevelMapping" />}
      <View style={styles.audioContainer}>
        <ScrollView horizontal contentContainerStyle={styles.audioScroll}>
          {draggableElements.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.audioButton,
                selectedAudio && selectedAudio.id === item.id && styles.selectedAudio,
                matches[item.id] && { backgroundColor: matches[item.id] },
              ]}
              onPress={() => handleAudioPress(item)}
              disabled={!!matches[item.id]}
            >
              <Image source={require('@/assets/images/audio.png')} style={styles.audioIcon} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {dropZonesData.map(zone => (
        <TouchableOpacity
          key={zone.id}
          style={[
            styles.dropZone,
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
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  audioContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
  audioScroll: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  audioButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedAudio: {
    borderWidth: 2,
    borderColor: 'blue',
  },
  audioIcon: {
    width: 30,
    height: 30,
  },
  dropZone: {
    position: 'absolute',
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Level2Listen;
