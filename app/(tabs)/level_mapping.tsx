import React, { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import BackButton from '../misc/BackButton';
import { LEVELS } from '../misc/constants';

const LevelMapping = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [buttonClicked, setButtonClicked] = useState(false);
  const [mode, setMode] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchMode = async () => {
      const storedMode = await AsyncStorage.getItem('mode');
      setMode(storedMode);
    };
    fetchMode();
  }, [buttonClicked]);

  const handleButtonClick = async (button: string) => {
    try {
      const newMode = button === 'button1' ? 'listen' : 'read';
      await AsyncStorage.setItem('mode', newMode);
      console.log(`${button} clicked, ${newMode} stored in AsyncStorage`);
      setButtonClicked(true);
    } catch (error) {
      console.error('Failed to store mode in AsyncStorage:', error);
    }
  };

  const handleLevelPress = (levelId: number) => {
    switch (levelId) {
      case 1:
        navigation.navigate('Guide1');
        break;
      case 2:
        navigation.navigate('Guide2');
        break;
      case 3:
        navigation.navigate('Guide3');
        break;
      case 4:
        navigation.navigate('Guide4');
        break;
      case 5:
        navigation.navigate('Guide5');
        break;
      case 6:
        navigation.navigate('Guide6');
        break;
      case 7:
        navigation.navigate('Guide7');
        break;
      default:
        console.error('Level not found');
        break;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Image
            source={require('@/assets/images/pantalla_nivel_modo.jpg')}
            style={styles.backgroundImage}
          />

          {/* Back Button */}
          <BackButton navigation={navigation} />

          {/* Contenedor central para centrar el contenido */}
          <View style={styles.content}>
            {!buttonClicked ? (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.button}
                  onPress={() => handleButtonClick('button1')}
                >
                  <Image
                    source={require('@/assets/images/niveles_texto.png')}
                    style={styles.buttonImage}
                    resizeMode="stretch"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.button}
                  onPress={() => handleButtonClick('button2')}
                >
                  <Image
                    source={require('@/assets/images/niveles_imagenes.png')}
                    style={styles.buttonImage}
                    resizeMode="stretch"
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView 
                horizontal 
                contentContainerStyle={styles.levelContainer}
                showsHorizontalScrollIndicator={false}
              >
                {LEVELS && LEVELS.map((level) => (
                  <TouchableOpacity
                    key={level.id}
                    activeOpacity={0.7}
                    onPress={() => handleLevelPress(level.id)}
                    style={styles.levelButton}
                  >
                    <Image
                      source={buttonClicked && mode === 'read' ? level.image2 : level.image}
                      style={styles.levelImage}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignSelf: 'stretch',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: wp('100%'),
    height: hp('100%'),
  },
  // Contenedor central que centra el contenido (botones o niveles)
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: wp('80%'),
    marginVertical: hp('2%'),
  },
  button: {
    marginHorizontal: wp('2%'),
  },
  buttonImage: {
    width: wp('20%'),
    height: hp('37%'),
  },

  levelContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('2%'),
  },
  levelButton: {
    width: wp('10%'),
    height: hp('18%'),
    marginHorizontal: wp('1%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default LevelMapping;
