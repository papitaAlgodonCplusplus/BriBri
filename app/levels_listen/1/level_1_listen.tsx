import React, { useState, useEffect } from 'react';
import {
  View,
  ImageBackground,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Audio } from 'expo-av';
import { NavigationProp } from '@react-navigation/native';
import BackButton from '../../misc/BackButton';
import NextButton from '../../misc/NextButton';
import { transform } from '@babel/core';

const bgImage = require('@/assets/images/guia1.jpeg');

// Draggable elements now only need the audio information for matching.
const draggableElements = [
  {
    id: 2,
    name: 'nolo kibi',
    audio: require('@/assets/audios/nolo_kibi_camino_antes_de_la_casa.wav'),
  },
  {
    id: 3,
    name: 'ale',
    audio: require('@/assets/audios/ale_alero.wav'),
  },
  {
    id: 1,
    name: 'nolo nkuo',
    audio: require('@/assets/audios/nolo_nkuo_caminito_de_la_casa.wav'),
  },
  {
    id: 4,
    name: 'kapo',
    audio: require('@/assets/audios/kapo_hamaca.wav'),
  },
];

// Define the target zones with the expected match name and a color for when a match is made.
const dropZonesData = [
  { matchName: 'kapo', expectedColor: 'orange' },
  { matchName: 'nolo kibi', expectedColor: 'green' },
  { matchName: 'nolo nkuo', expectedColor: 'yellow' },
  { matchName: 'ale', expectedColor: 'red' },
];

// Use the exact positioning from your provided dropZoneStyles.
const dropZoneStyles = StyleSheet.create({
  // Order here: zoneContainer1 expects "nolo kibi" (orange), zoneContainer2 expects "ale" (green),
  // zoneContainer3 expects "nolo nkuo" (yellow), zoneContainer4 expects "kapo" (red).
  zoneContainer1: {
      width: 145, // reduced size in half
      height: 45, // reduced size in half
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 10,
      left: 110, // adjusted from 580, -50
      top: 150, // adjusted from -60, -100
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
    left: -100,
    top: 170,
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
    left: -140,
    top: 170,
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
    left: -20,
    top: -70,
    borderColor: 'red',
    borderWidth: 4,
  },
} as Record<string, any>);

const Level1Listen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  // State for the currently selected (played) audio prompt.
  const [selectedAudio, setSelectedAudio] = useState<any>(null);
  // Track successful matches: key = matchName, value = expectedColor.
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [canContinue, setCanContinue] = useState(false);

  // Play the audio associated with the prompt.
  const playSound = async (audio: any) => {
    try {
      const { sound } = await Audio.Sound.createAsync(audio);
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing sound', error);
    }
  };

  // When an audio button is tapped, play its sound and set it as selected.
  const handleAudioPress = (item: any) => {
    if (matches[item.name]) return; // Already matched.
    setSelectedAudio(item);
    playSound(item.audio);
  };

  // When a drop zone is tapped, check if it matches the selected audio.
  const handleObjectPress = (zone: { matchName: string; expectedColor: string }) => {
    if (!selectedAudio) return;
    console.log('Selected audio:', selectedAudio.name, 'Expected:', zone.matchName);
    if (selectedAudio.name === zone.matchName) {
      setMatches((prev) => ({ ...prev, [zone.matchName]: zone.expectedColor }));
    }
    setSelectedAudio(null);
  };

  // Once all matches are made, allow the user to continue.
  useEffect(() => {
    if (Object.keys(matches).length === dropZonesData.length) {
      setCanContinue(true);
    }
  }, [matches]);

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={bgImage} style={styles.bgImage} />

      {/* Back Button */}
      <BackButton navigation={navigation} />

      {/* Next Button – only visible after all matches */}
      {canContinue && <NextButton navigation={navigation} nextName="LevelMapping" />}

      {/* Audio prompt container: displays white buttons with an audio icon */}
      <View style={styles.audioContainer}>
        <ScrollView horizontal contentContainerStyle={styles.audioScroll}>
          {draggableElements.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.audioButton,
                selectedAudio && selectedAudio.name === item.name && styles.selectedAudio,
                // If matched, change background to the assigned color.
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

      {/* Drop zones container: displays the target zones for matching (without word images) */}
      <View style={styles.objectsContainer}>
        {dropZonesData.map((zone, index) => (
          <TouchableOpacity
            key={zone.matchName}
            style={[
              dropZoneStyles[`zoneContainer${index + 1}`],
              matches[zone.matchName] && { backgroundColor: matches[zone.matchName] },
            ]}
            onPress={() => handleObjectPress(zone)}
          >
            {/* Word images removed */}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    width: '115%',
    height: '140%',
    left: 70,
    top: -160,
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
  objectsContainer: {
    position: 'absolute',
    top: 50,
    width: '100%',
    alignItems: 'center',
  },
});

export default Level1Listen;
