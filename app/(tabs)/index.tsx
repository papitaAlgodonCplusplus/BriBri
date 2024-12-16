import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HomePage from '@/app/(tabs)/homepage';

const App = () => {
    return (
        <View style={styles.container}>
        <HomePage />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default App;