import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

interface NextButtonProps {
    navigation: NavigationProp<any>;
    nextName: string;
}

const NextButton: React.FC<NextButtonProps> = ({ navigation, nextName }) => {
    const handleContinue = () => {
        navigation.navigate(nextName);
    }

    return (
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Image
                source={require('@/assets/images/button.png')}
                style={styles.buttonImageBottom}
            />
            <Image
                source={require('@/assets/images/atras.png')}
                style={styles.adelante}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    adelante: {
        width: 90,
        height: 45,
        transform: [{ rotate: '180deg' }],
        resizeMode: 'stretch',
    },
    button: {
        position: 'absolute',
        bottom: 20,
        right: 10,
        zIndex: 1,
    },
    buttonImageBottom: {
        width: '100%',
        height: 115,
        position: 'absolute',
        bottom: -34,
        right: 1,
        resizeMode: 'stretch',
    },
});

export default NextButton;
