import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Alert, SafeAreaView } from 'react-native';

const HomePage = () => {
  const handlePress = () => {
    Alert.alert('Button Pressed!', 'You clicked the button.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('@/assets/images/pantalla_principal.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <TouchableOpacity onPress={handlePress} style={styles.button}>
        <Image
          source={require('@/assets/images/jugar.png')}
          style={styles.buttonImage}
        />
      </TouchableOpacity>

      <Image
        source={require('@/assets/images/button.png')}
        style={styles.buttonImageBottom}
      />

      <TouchableOpacity onPress={handlePress} style={styles.button}>
        <Image
          source={require('@/assets/images/instrucciones.png')}
          style={styles.instrucciones}
        />
      </TouchableOpacity> 

      <TouchableOpacity onPress={handlePress} style={styles.button}>
        <Image
          source={require('@/assets/images/creditos.png')}
          style={styles.creditos}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '105%',
    height: '103%',
    transform: [{ 
      translateY: '-2%',
    }],
    resizeMode: 'cover',
  },
  button: {
    position: 'absolute',
    left: 40,  
    top: '6%',
  },
  buttonImage: {
    width: 350,
    height: 350,
    resizeMode: 'contain',
  },
  buttonImageBottom: {
    width: '20%',
    height: 100,
    position: 'absolute',
    bottom: 1,
    right: 10,
  },
  instrucciones: {
    width: 40,
    height: 40,
    left: 685,
    top: 315,
  },
  creditos: {
    width: 40,
    height: 40,
    left: 745,
    top: 315,
  },
});

export default HomePage;
