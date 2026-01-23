import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import * as FileSystem from 'expo-file-system/legacy';
import { FoodItem } from '../types';
import { API_KEY } from '../constants/Secrets';

// Initialize Gemini Client
const genAI = new GoogleGenerativeAI(API_KEY);

// Define the schema for structured output (JSON Mode)
const foodItemSchema = {
    type: SchemaType.ARRAY,
    items: {
        type: SchemaType.OBJECT,
        properties: {
            id: { type: SchemaType.STRING },
            name: { type: SchemaType.STRING },
            portionSize: { type: SchemaType.STRING },
            nutrition: {
                type: SchemaType.OBJECT,
                properties: {
                    calories: { type: SchemaType.NUMBER },
                    protein: { type: SchemaType.NUMBER },
                    carbs: { type: SchemaType.NUMBER },
                    fat: { type: SchemaType.NUMBER },
                },
                required: ["calories", "protein", "carbs", "fat"],
            },
            confidence: { type: SchemaType.NUMBER },
            reasoning: { type: SchemaType.STRING },
            healthStatus: { type: SchemaType.STRING, enum: ["Healthy", "Moderate", "Unhealthy"] },
            alternatives: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING },
            },
        },
        required: ["id", "name", "portionSize", "nutrition", "confidence", "reasoning", "healthStatus", "alternatives"],
    },
};

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash", // Switching to 2.5-flash due to 2.0 quota limits
    generationConfig: {
        responseMimeType: "application/json",
        responseSchema: foodItemSchema as any,
    },
});

export const mockAnalyzeFood = async (imageUri: string): Promise<FoodItem[]> => {
    try {
        console.log("Reading image...");

        // Read image as base64
        // Note: If 'expo-file-system' fails, try 'expo-file-system/legacy'
        let base64;
        try {
            base64 = await FileSystem.readAsStringAsync(imageUri, {
                encoding: 'base64',
            });
        } catch (e) {
            // Fallback for newer Expo versions if strict main import fails
            console.warn("Standard FileSystem read failed, trying legacy/options", e);
            // You might need to import legacy here dynamically if static import fails, 
            // but usually sticking to one is better. Let's assume standard works or we revert import.
            throw e;
        }

        // Construct the prompt
        console.log("Sending to Gemini...");
        const prompt = "Analyze this food image. Identify the items with portion sizes, nutrition, and health assessment.";

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64,
                    mimeType: "image/jpeg",
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        console.log('Gemini Response:', text);

        const foodItems: FoodItem[] = JSON.parse(text);
        return foodItems;

    } catch (error) {
        console.error('AI Analysis Failed:', error);
        throw error;
    }
};
