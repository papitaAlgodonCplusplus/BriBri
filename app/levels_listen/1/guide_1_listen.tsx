import React, { useState, useEffect } from 'react';
import { View, ImageBackground, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import { Audio } from 'expo-av';
import BackButton from '@/app/misc/BackButton';
import NextButton from '@/app/misc/NextButton';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const GuideListen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const bgImage = require('@/assets/images/guia1.jpeg');

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

  // Map audio boxes with the desired mapping
  const audioBoxesData = [
    { name: 'kapo', style: audioBoxStyles.zoneContainer1 },
    { name: 'nolo kibi', style: audioBoxStyles.zoneContainer2 },
    { name: 'nolo nkuo', style: audioBoxStyles.zoneContainer3 },
    { name: 'ale', style: audioBoxStyles.zoneContainer4 },
  ];

  // Function to play audio
  const playSound = async (audio: any) => {
    try {
      const { sound } = await Audio.Sound.createAsync(audio);
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing sound', error);
    }
  };

  // When an audio box is pressed, find its audio file and play it
  const handleAudioBoxPress = (name: string) => {
    const element = draggableElements.find(e => e.name === name);
    if (element) {
      playSound(element.audio);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ImageBackground 
          source={bgImage} 
          style={styles.bgImage}
          imageStyle={{ resizeMode: 'contain' }}
        >
          {/* Audio boxes overlay on the background */}
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
        </ImageBackground>
        
        <View style={styles.buttonsBackContainer}>
          <BackButton navigation={navigation} />
        </View>
        
        <View style={styles.buttonsNextContainer}>
          <NextButton navigation={navigation} nextName="Level1Listen" />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

// Audio box styles based on drop zones positions
const audioBoxStyles = StyleSheet.create({
  zoneContainer1: {
    position: 'absolute',
    width: wp('12%'),
    height: hp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
    left: wp('40%'),
    top: hp('23%'),
    borderColor: 'orange',
    backgroundColor: 'rgba(255, 165, 0, 0.3)',
    borderWidth: 2,
    borderRadius: 5,
  },
  zoneContainer2: {
    position: 'absolute',
    width: wp('12%'),
    height: hp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
    left: wp('16%'),
    top: hp('24%'),
    backgroundColor: 'rgba(0, 255, 0, 0.3)',
    borderColor: 'green',
    borderWidth: 2,
    borderRadius: 5,
  },
  zoneContainer3: {
    position: 'absolute',
    width: wp('12%'),
    height: hp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
    left: wp('10%'),
    top: hp('12%'),
    backgroundColor: 'rgba(255, 255, 0, 0.3)',
    borderColor: 'yellow',
    borderWidth: 2,
    borderRadius: 5,
  },
  zoneContainer4: {
    position: 'absolute',
    width: wp('12%'),
    height: hp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
    left: wp('20%'),
    top: hp('5%'),
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
    borderColor: 'red',
    borderWidth: 2,
    borderRadius: 5,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
    justifyContent: 'center',
  },
  bgImage: {
    position: 'absolute',
    alignSelf: 'center',
    width: wp('80%'),
    height: hp('100%'),
  },
  audioBoxesContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  audioIcon: {
    width: wp('6%'),
    height: hp('3%'),
    resizeMode: 'contain',
  },
  buttonsBackContainer: {
    bottom: hp('53%'),
    right: wp('3%'),
  },
  buttonsNextContainer: {
    top: hp('47.5%'),
    left: wp('1.2%'),
  },
});

export default GuideListen;