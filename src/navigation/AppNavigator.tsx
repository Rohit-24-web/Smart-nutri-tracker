import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';

import { CameraScreen } from '../screens/CameraScreen';

import { HistoryScreen } from '../screens/HistoryScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Dashboard' }} />
                <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Meal Log' }} />
                <Stack.Screen name="Camera" component={CameraScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
