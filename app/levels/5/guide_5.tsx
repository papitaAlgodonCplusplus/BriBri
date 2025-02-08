import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '@/app/misc/BackButton';
import NextButton from '@/app/misc/NextButton';
import { NavigationProp } from '@react-navigation/native';

const Guide = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const bgImage = require('@/assets/images/guia5.png');

    const [mode, setMode] = useState<'read' | 'listen' | null>(null);

    useEffect(() => {
        const fetchMode = async () => {
            const storedMode = await AsyncStorage.getItem('mode');
            setMode(storedMode === 'read' || storedMode === 'listen' ? storedMode : 'listen');
        };
        fetchMode();
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ImageBackground source={bgImage} style={styles.bgImage}>
            </ImageBackground>
            <BackButton navigation={navigation} />
            <NextButton navigation={navigation} nextName="Level5" />
        </View>
    );
};

const styles: { [key: string]: any } = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    bgImage: {
        flex: 1,
        resizeMode: 'stretch',
        justifyContent: 'center',
        width: '85%',
        height: '95%',
        top: 23,
        left: -8,
    },
});

export default Guide;
