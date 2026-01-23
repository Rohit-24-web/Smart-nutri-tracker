export interface Nutrition {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
}

export interface FoodItem {
    id: string;
    name: string;
    confidence: number;
    portionSize: string; // e.g., "1 cup", "100g"
    nutrition: Nutrition;
    boundingBox?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    ingredients?: FoodItem[]; // For complex dishes like Biryani
    cookingHealthScore?: number; // 0-100
    reasoning?: string; // AI explanation
    healthStatus?: 'Healthy' | 'Moderate' | 'Unhealthy';
    alternatives?: string[];
}

export interface Meal {
    id: string;
    userId: string;
    imageUrl: string;
    timestamp: number; // Unix timestamp
    items: FoodItem[];
    totalNutrition: Nutrition;
    mood?: string;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface UserProfile {
    id: string;
    name: string;
    healthGoals: string[];
    conditions: string[]; // e.g., 'Diabetes', 'PCOS'
    dietaryPreferences: string[];
}
