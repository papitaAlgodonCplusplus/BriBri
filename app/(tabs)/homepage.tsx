import React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
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
        <Image
          source={require('@/assets/images/pantalla_principal.png')}
          style={styles.backgroundImage}
          resizeMode="stretch"
        />

        <TouchableOpacity onPress={handlePress} style={styles.buttonImageContainer}>
          <Image
            source={require('@/assets/images/jugar.png')}
            style={styles.buttonImage}
            resizeMode="stretch"
          />
        </TouchableOpacity>

        <Image
          source={require('@/assets/images/button.png')}
          style={styles.buttonImageBottom}
          resizeMode="stretch"
        />

        <TouchableOpacity onPress={handleInstrucciones} style={styles.button}>
          <Image
            source={require('@/assets/images/instrucciones.png')}
            style={styles.instrucciones}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleCreditos} style={styles.button}>
          <Image
            source={require('@/assets/images/creditos.png')}
            style={styles.creditos}
            resizeMode="stretch"
          />
        </TouchableOpacity>
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
    transform: [{ 
      translateY: '-3%',
    }],
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
  buttonImageBottom: {
    position: 'absolute',
    width: wp('20%'),
    height: hp('30%'),
    bottom: wp('-2%'),
    right: hp('5%'),
  },
  button: {
    position: 'absolute',
    bottom: hp('7.9%'),
    right: wp('13%'),
  },
  instrucciones: {
    width: wp('7%'),
    height: hp('7%'),
  },
  creditos: {
    width: wp('7%'),
    height: hp('7%'),
    left: wp('7.5%'),
  },
});

export default HomePage;
