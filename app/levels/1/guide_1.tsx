import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '@/app/misc/BackButton';
import NextButton from '@/app/misc/NextButton';
import { NavigationProp } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const Guide = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const bgImage = require('@/assets/images/guia1.png');

  const [mode, setMode] = useState<'read' | 'listen' | null>(null);

  useEffect(() => {
    const fetchMode = async () => {
      const storedMode = await AsyncStorage.getItem('mode');
      setMode(storedMode === 'read' || storedMode === 'listen' ? storedMode : 'listen');
    };
    fetchMode();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ImageBackground 
          source={bgImage} 
          style={styles.bgImage}
          imageStyle={{ resizeMode: 'contain' }}
        />
        <View style={styles.buttonsBackContainer}>
          <BackButton navigation={navigation} />
        </View>
        <View style={styles.buttonsNextContainer}>
          <NextButton navigation={navigation} nextName="Level1" />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

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
buttonsBackContainer: {
    bottom: hp('53%'),
    right: wp('3%'),
  },
  buttonsNextContainer: {
    top: hp('47.5%'),
    left: wp('1.2%'),
  },
});

export default Guide;