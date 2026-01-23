import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, Button, ActivityIndicator, ScrollView } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { mockAnalyzeFood } from '../services/aiService';
import { FoodItem } from '../types';

export const CameraScreen = ({ navigation }: any) => {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [photo, setPhoto] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [results, setResults] = useState<FoodItem[] | null>(null);
    const cameraRef = useRef<CameraView>(null);

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    const toggleCameraFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.7,
                    base64: true,
                });
                if (photo) {
                    setPhoto(photo.uri);
                    // Here we would send to AI
                    console.log('Photo taken:', photo.uri);
                }
            } catch (error) {
                Alert.alert('Error', 'Failed to take picture');
            }
        }
    };

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setPhoto(result.assets[0].uri);
        }
    };

    const analyzePhoto = async () => {
        if (!photo) return;
        setAnalyzing(true);
        try {
            const data = await mockAnalyzeFood(photo);
            setResults(data);
        } catch (e) {
            Alert.alert("Error", "Could not analyze food");
        } finally {
            setAnalyzing(false);
        }
    };

    const reset = () => {
        setPhoto(null);
        setResults(null);
    };

    return (
        <View style={styles.container}>
            {photo ? (
                <View style={styles.previewContainer}>
                    <Image source={{ uri: photo }} style={styles.preview} />
                    {results ? (
                        <View style={styles.resultsOverlay}>
                            <Text style={styles.resultTitle}>Detected Meal:</Text>
                            <ScrollView style={{ maxHeight: 200 }}>
                                {results.map((item, idx) => (
                                    <View key={idx} style={styles.resultItem}>
                                        <Text style={styles.foodName}>{item.name} ({item.portionSize})</Text>
                                        <Text style={styles.foodMacro}>{item.nutrition.calories} kcal | P: {item.nutrition.protein}g</Text>
                                        {item.reasoning && <Text style={styles.reasoning}>AI: {item.reasoning}</Text>}
                                    </View>
                                ))}
                            </ScrollView>
                            <Button title="Save & Track" onPress={async () => {
                                if (results) {
                                    const { saveMeal } = require('../services/storageService');
                                    await saveMeal(results);
                                    Alert.alert("Saved!", "Your meal has been logged.");
                                    navigation.goBack();
                                }
                            }} />
                            <Button title="Discard" color="red" onPress={reset} />
                        </View>
                    ) : (
                        <View style={styles.actionRow}>
                            {analyzing ? (
                                <ActivityIndicator size="large" color={COLORS.primary} />
                            ) : (
                                <>
                                    <TouchableOpacity style={styles.button} onPress={() => setPhoto(null)}>
                                        <Text style={styles.text}>Retake</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={analyzePhoto}>
                                        <Text style={styles.textPrimary}>Analyze Meal</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    )}
                </View>
            ) : (
                <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.controlButton} onPress={pickImage}>
                            <Text style={styles.text}>Gallery</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                            <View style={styles.captureInner} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
                            <Text style={styles.text}>Flip</Text>
                        </TouchableOpacity>
                    </View>
                </CameraView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'black',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
        color: 'white',
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
        padding: SPACING.m,
        backgroundColor: 'rgba(50, 50, 50, 0.8)',
        marginHorizontal: SPACING.s,
        borderRadius: RADIUS.m,
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    textPrimary: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 0,
    },
    captureInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'white',
    },
    controlButton: {
        padding: SPACING.m,
    },
    previewContainer: {
        flex: 1,
        backgroundColor: 'black',
    },
    preview: {
        flex: 1,
        resizeMode: 'contain',
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: SPACING.l,
        backgroundColor: 'black',
    },
    resultsOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopLeftRadius: RADIUS.l,
        borderTopRightRadius: RADIUS.l,
        padding: SPACING.l,
        maxHeight: '60%',
    },
    resultTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: SPACING.m,
    },
    resultItem: {
        marginBottom: SPACING.m,
        padding: SPACING.s,
        backgroundColor: COLORS.background,
        borderRadius: RADIUS.s,
    },
    foodName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    foodMacro: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    reasoning: {
        fontSize: 12,
        fontStyle: 'italic',
        color: COLORS.primary,
        marginTop: 4,
    }
});
