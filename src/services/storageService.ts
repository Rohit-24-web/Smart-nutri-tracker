
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FoodItem } from '../types';

export interface HistoryItem {
    id: string;
    date: string; // ISO string
    items: FoodItem[];
    totalCalories: number;
}

const STORAGE_KEY = '@food_history';

export const saveMeal = async (foodItems: FoodItem[]) => {
    try {
        const history = await getHistory();
        const newEntry: HistoryItem = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            items: foodItems,
            totalCalories: foodItems.reduce((sum, item) => sum + item.nutrition.calories, 0),
        };

        const updatedHistory = [newEntry, ...history];
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
        return true;
    } catch (e) {
        console.error('Failed to save meal', e);
        return false;
    }
};

export const getHistory = async (): Promise<HistoryItem[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Failed to load history', e);
        return [];
    }
};

export const clearHistory = async () => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
        console.error('Failed to clear history', e);
    }
}
