import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Text,
  Animated,
  Easing
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import BackButton from '../misc/BackButton';
import { LEVELS } from '../misc/constants';

const LevelMapping = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [buttonClicked, setButtonClicked] = useState(false);
  const [mode, setMode] = useState<string | null>(null);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [toucanEnabled, setToucanEnabled] = useState(true);

  const toucanPosition = useRef(new Animated.ValueXY({ x: wp('70%'), y: hp('15%') })).current;
  const bubbleOpacity = useRef(new Animated.Value(0)).current;
  const buttonHighlight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Load previously selected mode
        const storedMode = await AsyncStorage.getItem('mode');
        setMode(storedMode);

        // Check toucan preferences
        const toucanStatus = await AsyncStorage.getItem('toucanGuideEnabled');
        setToucanEnabled(toucanStatus !== 'false');

        // Check if level mapping tutorial has been completed
        const levelMappingTutorial = await AsyncStorage.getItem('levelMappingTutorialCompleted');

        // Start tutorial if it hasn't been completed and toucan is enabled
        if (levelMappingTutorial !== 'true' && toucanStatus !== 'false') {
          startTutorial();
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    fetchSettings();
  }, [buttonClicked]);

  const startTutorial = () => {
    setTutorialStep(1);

    // Start with intro animation
    Animated.sequence([
      Animated.timing(toucanPosition, {
        toValue: { x: wp('50%'), y: hp('40%') },
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(bubbleOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const advanceTutorial = () => {
    // Reset animations
    bubbleOpacity.setValue(0);
    buttonHighlight.setValue(0);

    // Move to next step
    const nextStep = tutorialStep + 1;
    setTutorialStep(nextStep);

    // Different animations based on tutorial step
    switch (nextStep) {
      case 2: // Point to mode selection
        Animated.parallel([
          Animated.timing(toucanPosition, {
            toValue: { x: wp('40%'), y: hp('50%') },
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(bubbleOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
            delay: 800,
          }),
          Animated.loop(
            Animated.sequence([
              Animated.timing(buttonHighlight, {
                toValue: 1,
                duration: 800,
                useNativeDriver: false,
              }),
              Animated.timing(buttonHighlight, {
                toValue: 0.2,
                duration: 800,
                useNativeDriver: false,
              }),
            ]),
            { iterations: 3 }
          ),
        ]).start();
        break;
      case 3: // Point to level selection (after mode is chosen)
        if (buttonClicked) {
          Animated.parallel([
            Animated.timing(toucanPosition, {
              toValue: { x: wp('50%'), y: hp('50%') },
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(bubbleOpacity, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
              delay: 800,
            }),
          ]).start();
        } else {
          // If mode hasn't been selected yet, just stay at step 2
          setTutorialStep(2);

          // Run the step 2 animations again without recursively calling advanceTutorial
          Animated.parallel([
            Animated.timing(toucanPosition, {
              toValue: { x: wp('40%'), y: hp('50%') },
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(bubbleOpacity, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
              delay: 800,
            }),
            Animated.loop(
              Animated.sequence([
                Animated.timing(buttonHighlight, {
                  toValue: 1,
                  duration: 800,
                  useNativeDriver: false,
                }),
                Animated.timing(buttonHighlight, {
                  toValue: 0.2,
                  duration: 800,
                  useNativeDriver: false,
                }),
              ]),
              { iterations: 3 }
            ),
          ]).start();
        }
        break;
      case 4: // Final message
        Animated.parallel([
          Animated.timing(toucanPosition, {
            toValue: { x: wp('70%'), y: hp('15%') },
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(bubbleOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
            delay: 800,
          }),
        ]).start();
        break;
      case 5: // Complete
        completeTutorial();
        break;
    }
  };

  const completeTutorial = async () => {
    try {
      await AsyncStorage.setItem('levelMappingTutorialCompleted', 'true');
      setTutorialStep(0);

      // Animate toucan to final position
      Animated.parallel([
        Animated.timing(bubbleOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(toucanPosition, {
          toValue: { x: wp('70%'), y: hp('15%') },
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (error) {
      console.error('Error saving tutorial state:', error);
    }
  };

  const handleButtonClick = async (button: string) => {
    try {
      const newMode = button === 'button1' ? 'listen' : 'read';
      await AsyncStorage.setItem('mode', newMode);
      console.log(`${button} clicked, ${newMode} stored in AsyncStorage`);
      setButtonClicked(true);

      // If in tutorial, advance to next step
      if (tutorialStep === 2) {
        advanceTutorial();
      }
    } catch (error) {
      console.error('Failed to store mode in AsyncStorage:', error);
    }
  };

  const handleLevelPress = (levelId: number) => {
    // If in tutorial step 3, advance tutorial
    if (tutorialStep === 3) {
      advanceTutorial();
    }

    if (mode === 'read') {
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
    } else {
      switch (levelId) {
        case 1:
          navigation.navigate('Guide1Listen');
          break;
        case 2:
          navigation.navigate('Guide2Listen');
          break;
        case 3:
          navigation.navigate('Guide3Listen');
          break;
        case 4:
          navigation.navigate('Guide4Listen');
          break;
        case 5:
          navigation.navigate('Guide5Listen');
          break;
        case 6:
          navigation.navigate('Guide6Listen');
          break;
        case 7:
          navigation.navigate('Guide7Listen');
          break;
        default:
          console.error('Level not found');
          break;
      }
    }
  };

  const handleToucanPress = () => {
    if (tutorialStep > 0) {
      advanceTutorial();
    } else {
      // Normal toucan behavior when not in tutorial
    }
  };

  // Get tutorial message based on current step
  const getTutorialMessage = () => {
    switch (tutorialStep) {
      case 1:
        return '¡Bienvenido a la selección de niveles! Aquí podrás elegir cómo quieres aprender BriBri.';
      case 2:
        return 'Primero, elige tu modo de aprendizaje: con audio o con texto e imágenes.';
      case 3:
        return 'Ahora puedes seleccionar el nivel que quieres jugar. ¡Empieza por el primero!';
      case 4:
        return '¡Perfecto! Ahora ya sabes cómo seleccionar niveles y modos. ¡Vamos a aprender BriBri!';
      default:
        return '';
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

          {/* Toucan Guide with animated position */}
          {toucanEnabled && (
            <Animated.View
              style={[
                styles.toucanContainer,
                {
                  transform: [
                    { translateX: toucanPosition.x },
                    { translateY: toucanPosition.y }
                  ]
                }
              ]}
            >
              <Animated.View style={[
                styles.speechBubble,
                { opacity: bubbleOpacity }
              ]}>
                <Text style={styles.speechText}>{getTutorialMessage()}</Text>
                {tutorialStep > 0 && tutorialStep < 5 && (
                  <Text style={styles.tapToContinue}>Tócame para continuar</Text>
                )}
              </Animated.View>

              <TouchableOpacity
                onPress={handleToucanPress}
                activeOpacity={0.7}
              >
                <Image
                  source={require('@/assets/images/toucan_idle.png')}
                  style={styles.toucanImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Back Button */}
          <BackButton navigation={navigation} />

          {/* Contenedor central para centrar el contenido */}
          <View style={styles.content}>
            {!buttonClicked ? (
              <View style={styles.buttonContainer}>
                {/* Highlight for mode buttons during tutorial */}
                {tutorialStep === 2 && (
                  <Animated.View
                    style={[
                      styles.modeButtonsHighlight,
                      { opacity: buttonHighlight }
                    ]}
                  />
                )}

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
                {/* Highlight for level buttons during tutorial */}
                {tutorialStep === 3 && (
                  <Animated.View
                    style={[
                      styles.levelButtonsHighlight,
                      { opacity: buttonHighlight }
                    ]}
                  />
                )}

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
  // Toucan Guide styles
  toucanContainer: {
    position: 'absolute',
    zIndex: 10,
  },
  toucanImage: {
    width: wp('20%'),
    height: hp('20%'),
  },
  speechBubble: {
    position: 'absolute',
    top: -hp('12%'),
    right: wp('5%'),
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    borderWidth: 2,
    borderColor: '#FFD700',
    width: wp('45%'),
    minHeight: hp('10%'),
    zIndex: 11,
  },
  speechText: {
    fontSize: hp('1.8%'),
    color: '#333',
    textAlign: 'center',
  },
  tapToContinue: {
    fontSize: hp('1.5%'),
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
    fontStyle: 'italic',
  },
  modeButtonsHighlight: {
    position: 'absolute',
    width: wp('65%'),
    height: hp('40%'),
    backgroundColor: 'rgba(255,255,0,0.3)',
    borderRadius: 15,
    zIndex: 4,
  },
  levelButtonsHighlight: {
    position: 'absolute',
    width: wp('80%'),
    height: hp('20%'),
    backgroundColor: 'rgba(255,255,0,0.3)',
    borderRadius: 15,
    zIndex: 4,
  },
});

export default LevelMapping;