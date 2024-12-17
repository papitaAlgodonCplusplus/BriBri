import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import BackButton from '../misc/BackButton';
import { LEVELS } from '../misc/constants';

const LevelMapping = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [unlockedLevels, setUnlockedLevels] = useState([1]);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const progress = await AsyncStorage.getItem('unlockedLevels');
        if (progress) {
          setUnlockedLevels(JSON.parse(progress));
        }
      } catch (error) {
        console.error('Failed to load progress:', error);
      }
    };

    loadProgress();
  }, []);

  const handleLevelPress = (levelId: number) => {
    if (unlockedLevels.includes(levelId)) {
      switch (levelId) {
        case 1:
          navigation.navigate('Guide1');
          break;
        default:
          console.error('Level not found');
          break;
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/cr_bg.png')} style={styles.backgroundImage} />

      {/* Back Button */}
      <BackButton navigation={navigation} />

      <ScrollView horizontal contentContainerStyle={styles.levelContainer}>
        {LEVELS && LEVELS.map((level) => (
          <TouchableOpacity
            key={level.id}
            onPress={() => handleLevelPress(level.id)}
            disabled={!unlockedLevels.includes(level.id)}
            style={styles.levelButton}
          >
            <Image
              source={level.image}
              style={[styles.levelImage, !unlockedLevels.includes(level.id) && styles.lockedLevel]}
            />
            {!unlockedLevels.includes(level.id) && <Text style={styles.lockText}>Bloqueado</Text>}
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  lockedLevel: {
    opacity: 0.5,
  },
  lockText: {
    color: 'rgb(49, 49, 49)',
    fontWeight: 'bold',
  },
});

export default LevelMapping;
