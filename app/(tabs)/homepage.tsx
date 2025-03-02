import React from 'react';
import { StyleSheet, Image, TouchableOpacity, View } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const HomePage = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const handlePress = () => {
    navigation.navigate('LevelMapping');
  };

  const handleInstrucciones = () => {
    // Lógica para instrucciones
  };

  const handleCreditos = () => {
    // Lógica para créditos
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Fondo principal */}
        <Image
          source={require('@/assets/images/pantalla_principal.png')}
          style={styles.backgroundImage}
          resizeMode="stretch"
        />

        {/* Botón "Jugar" */}
        <TouchableOpacity onPress={handlePress} style={styles.buttonImageContainer}>
          <Image
            source={require('@/assets/images/jugar.png')}
            style={styles.buttonImage}
            resizeMode="stretch"
          />
        </TouchableOpacity>

        {/* Contenedor inferior: conserva tamaño original y posicionamiento */}
        <View style={styles.bottomContainer}>
          <Image
            source={require('@/assets/images/button.png')}
            style={styles.buttonImageBottom}
            resizeMode="stretch"
          />
          {/* Contenedor interno para centrar los botones */}
          <View style={styles.bottomButtonsContainer}>
            <TouchableOpacity onPress={handleInstrucciones} style={styles.bottomButton}>
              <Image
                source={require('@/assets/images/instrucciones.png')}
                style={styles.buttonIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCreditos} style={styles.bottomButton}>
              <Image
                source={require('@/assets/images/creditos.png')}
                style={styles.buttonIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backgroundImage: {
    width: wp('100%'),
    height: hp('100%'),
    transform: [{ translateY: -hp('3%') }],
  },
  buttonImageContainer: {
    position: 'absolute',
    top: hp('30%'),
    left: wp('0.7%'),
  },
  buttonImage: {
    width: wp('27%'),
    height: hp('37%'),
  },
  // Contenedor inferior que conserva el tamaño original del botón (20% x 30%) y su posición
  bottomContainer: {
    position: 'absolute',
    bottom: wp('-2%'), // Mantiene el valor original (aunque idealmente sería en hp)
    right: hp('5%'),   // Igual aquí, se usa el valor original
    width: wp('20%'),
    height: hp('30%'),
  },
  buttonImageBottom: {
    width: '100%',
    height: '100%',
  },
  // Contenedor interno que centra los botones en el cuadro sin estirarlo
  bottomButtonsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomButton: {
    marginHorizontal: wp('0.1%'),
  },
  buttonIcon: {
    width: wp('7%'),
    height: hp('7%'),
  },
});

export default HomePage;
