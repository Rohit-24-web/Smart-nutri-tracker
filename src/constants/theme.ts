export const COLORS = {
    primary: '#10B981', // Emerald Green - vibrant & healthy
    primaryGradient: ['#10B981', '#059669'], // For buttons/cards
    secondary: '#3B82F6', // Royal Blue
    background: '#F0F9FF', // Very light blue/cool gray
    surface: '#FFFFFF',
    text: '#1F2937', // Gray-900
    textSecondary: '#6B7280', // Gray-500
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
    border: '#E5E7EB',
};

export const SPACING = {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
};

export const RADIUS = {
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    full: 9999,
};

export const SHADOWS = {
    small: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    medium: {
        shadowColor: "#10B981", // Slight green tint for premium feel
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
};

import { TextStyle } from "react-native";

export const FONTS = {
    h1: { fontSize: 32, fontWeight: '700' as TextStyle['fontWeight'], color: COLORS.text },
    h2: { fontSize: 24, fontWeight: '600' as TextStyle['fontWeight'], color: COLORS.text },
    body: { fontSize: 16, fontWeight: '400' as TextStyle['fontWeight'], color: COLORS.textSecondary },
    caption: { fontSize: 13, fontWeight: '500' as TextStyle['fontWeight'], color: COLORS.textSecondary },
};
