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

const bgImage = require('@/assets/images/ilustraciones-05.jpg');

// In listen mode only the audio is used
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

// Drop zones with predefined positions, sizes, and rotations
const dropZonesData = [
  { id: 1, matchName: 'aiko_ko', x: 300, y: 300, width: 80, height: 80, rotation: '0deg', borderColor: 'red', expectedColor: 'rgba(255, 0, 0, 0.3)' },
  { id: 2, matchName: 'kula', x: 675, y: 280, width: 105, height: 95, rotation: '0deg', borderColor: 'blue', expectedColor: 'rgba(0, 0, 255, 0.3)' },
  { id: 3, matchName: 'kule', x: 548, y: 290, width: 125, height: 90, rotation: '0deg', borderColor: 'green', expectedColor: 'rgba(0, 255, 0, 0.3)' },
  { id: 4, matchName: 'sabak_dule', x: 465, y: 270, width: 80, height: 110, rotation: '0deg', borderColor: 'orange', expectedColor: 'rgba(255, 165, 0, 0.3)' },
  { id: 5, matchName: 'sku', x: 584, y: 89, width: 90, height: 95, rotation: '0deg', borderColor: 'purple', expectedColor: 'rgba(128, 0, 128, 0.3)' },
  { id: 7, matchName: 'to_ta', x: 680, y: 180, width: 90, height: 80, rotation: '0deg', borderColor: 'yellow', expectedColor: 'rgba(255, 255, 0, 0.3)' },
  { id: 8, matchName: 'tska_tka', x: 380, y: 285, width: 85, height: 95, rotation: '0deg', borderColor: 'cyan', expectedColor: 'rgba(0, 255, 255, 0.3)' },
  { id: 9, matchName: 'u', x: 465, y: 70, width: 85, height: 85, rotation: '0deg', borderColor: 'pink', expectedColor: 'rgba(255, 192, 203, 0.3)' },
];

const Level7Listen = ({ navigation }: { navigation: NavigationProp<any> }) => {
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
    width: '120%',
    left: -10,
    top: -10,
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

export default Level7Listen;