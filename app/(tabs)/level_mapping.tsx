import React, { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text, ScrollView } from 'react-native';
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
      const mode = button === 'button1' ? 'listen' : 'read';
      await AsyncStorage.setItem('mode', mode);
      console.log(`${button} clicked, ${mode} stored in AsyncStorage`);
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
    <View style={styles.container}>
      <Image source={require('@/assets/images/cr_bg.png')} style={styles.backgroundImage} />

      {/* Back Button */}
      <BackButton navigation={navigation} />

      {!buttonClicked ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleButtonClick('button1')}>
            <Text style={styles.buttonText}>Pronunciación</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleButtonClick('button2')}>
            <Text style={styles.buttonText}>Escritura</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView horizontal contentContainerStyle={styles.levelContainer}>
          {LEVELS && LEVELS.map((level) => (
            <TouchableOpacity
              key={level.id}
              onPress={() => handleLevelPress(level.id)}
              style={styles.levelButton}
            >
              <Image source={buttonClicked && mode === 'read' ? level.image2 : level.image} style={styles.levelImage} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  actionButton: {
    marginHorizontal: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  levelButton: {
    marginHorizontal: 10,
    alignItems: 'center',
  },
  levelImage: {
    width: 100,
    height: 100,
    marginBottom: 5,
  },
});

export default LevelMapping;
