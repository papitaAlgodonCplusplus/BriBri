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

const bgImage = require('@/assets/images/ilustraciones-04.jpg');

// In listen mode only the audio is used
const draggableElements = [
  { id: 1, name: 'ukko', audio: require('@/assets/audios/ukko.wav') },
  { id: 2, name: 'ushu', audio: require('@/assets/audios/ushu.wav') },
  { id: 3, name: 'akwawe', audio: require('@/assets/audios/ak_wawe.wav') },
  { id: 4, name: 'ulok', audio: require('@/assets/audios/ulok.wav') },
  { id: 5, name: 'iwo', audio: require('@/assets/audios/iwo.wav') },
  { id: 6, name: 'ko', audio: require('@/assets/audios/ko.wav') },
  { id: 7, name: 'kapokua', audio: require('@/assets/audios/kapokua.wav') },
];

// Drop zones with predefined positions, sizes, and rotations
const dropZonesData = [
  { id: 1, matchName: 'ukko', x: 400, y: 270, width: 150, height: 80, rotation: '0deg', borderColor: 'purple', expectedColor: 'rgba(128, 0, 128, 0.3)' },
  { id: 2, matchName: 'ushu', x: 630, y: 40, width: 60, height: 50, rotation: '0deg', borderColor: 'red', expectedColor: 'rgba(255, 0, 0, 0.3)' },
  { id: 3, matchName: 'akwawe', x: 120, y: 30, width: 80, height: 60, rotation: '0deg', borderColor: 'blue', expectedColor: 'rgba(0, 0, 255, 0.3)' },
  { id: 4, matchName: 'ulok', x: 385, y: 10, width: 25, height: 60, rotation: '0deg', borderColor: 'green', expectedColor: 'rgba(0, 128, 0, 0.3)' },
  { id: 5, matchName: 'iwo', x: 170, y: 60, width: 40, height: 30, rotation: '0deg', borderColor: 'red', expectedColor: 'rgba(255, 0, 0, 0.3)' },
  { id: 6, matchName: 'ko', x: 470, y: 10, width: 40, height: 50, rotation: '0deg', borderColor: 'orange', expectedColor: 'rgba(255, 165, 0, 0.3)' },
  { id: 7, matchName: 'kapokua', x: 600, y: 180, width: 100, height: 25, rotation: '-20deg', borderColor: 'yellow', expectedColor: 'rgba(255, 255, 0, 0.3)' },
];

const Level6Listen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [selectedAudio, setSelectedAudio] = useState<any>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
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
    if (matches[item.name]) return;
    setSelectedAudio(item);
    playSound(item.audio);
  };

  const handleDropZonePress = (zone: any) => {
    if (!selectedAudio) return;
    console.log('Selected audio:', selectedAudio.name, 'Expected:', zone.matchName);
    if (selectedAudio.name === zone.matchName) {
      setMatches(prev => ({ ...prev, [zone.matchName]: zone.expectedColor }));
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
                selectedAudio && selectedAudio.name === item.name && styles.selectedAudio,
                matches[item.name] && { backgroundColor: matches[item.name] },
              ]}
              onPress={() => handleAudioPress(item)}
              disabled={!!matches[item.name]}
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
              backgroundColor: matches[zone.matchName] ? matches[zone.matchName] : 'transparent',
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

export default Level6Listen;