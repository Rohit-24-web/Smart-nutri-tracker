
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getHistory, clearHistory, HistoryItem } from "../services/storageService";
import { COLORS, SPACING, RADIUS, SHADOWS, FONTS } from "../constants/theme";
import { useIsFocused } from "@react-navigation/native";

export const HistoryScreen = () => {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const isFocused = useIsFocused();

    const loadHistory = async () => {
        const data = await getHistory();
        setHistory(data);
    };

    useEffect(() => {
        if (isFocused) {
            loadHistory();
        }
    }, [isFocused]);

    const handleClear = async () => {
        Alert.alert(
            "Clear History",
            "Are you sure you want to delete all tracked meals?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        await clearHistory();
                        loadHistory();
                    }
                }
            ]
        );
    };

    const getHealthColor = (status?: string) => {
        switch (status) {
            case 'Healthy': return COLORS.success;
            case 'Unhealthy': return COLORS.danger;
            case 'Moderate': return COLORS.warning;
            default: return COLORS.textSecondary;
        }
    };

    const renderItem = ({ item }: { item: HistoryItem }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.dateContainer}>
                    <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
                    <Text style={styles.date}>
                        {new Date(item.date).toLocaleDateString()} • {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
                <View style={styles.calorieBadge}>
                    <Ionicons name="flame" size={14} color={COLORS.warning} />
                    <Text style={styles.calorieText}>{Math.round(item.totalCalories)} kcal</Text>
                </View>
            </View>

            <View style={styles.divider} />

            {item.items.map((food, idx) => (
                <View key={idx} style={styles.foodRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <View style={[styles.dot, { backgroundColor: getHealthColor(food.healthStatus) }]} />
                        <Text style={styles.foodName}>{food.name}</Text>
                        <Text style={styles.portion}>({food.portionSize})</Text>
                    </View>
                    {food.healthStatus && (
                        <Text style={[styles.healthTag, { color: getHealthColor(food.healthStatus) }]}>
                            {food.healthStatus}
                        </Text>
                    )}
                </View>
            ))}

            {/* Suggestion for unhealthy items? (Optional, just showing if available) */}
            {item.items.some(f => f.alternatives && f.alternatives.length > 0) && (
                <View style={styles.tipContainer}>
                    <Ionicons name="bulb-outline" size={16} color={COLORS.primary} />
                    <Text style={styles.tipText}>Tip: Try {item.items.find(f => f.alternatives?.length)?.alternatives?.[0]} next time!</Text>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.screenTitle}>Meal Log</Text>
                {history.length > 0 && (
                    <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
                        <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
                    </TouchableOpacity>
                )}
            </View>

            {history.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="book-outline" size={64} color={COLORS.border} />
                    <Text style={styles.emptyText}>No history yet</Text>
                    <Text style={styles.emptySubtext}>Your tracked meals will appear here.</Text>
                </View>
            ) : (
                <FlatList
                    data={history}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.l,
        paddingTop: SPACING.l,
        paddingBottom: SPACING.s,
    },
    screenTitle: {
        ...FONTS.h2,
        color: COLORS.text,
    },
    clearBtn: {
        padding: SPACING.s,
        backgroundColor: '#FEF2F2',
        borderRadius: RADIUS.full,
    },
    list: {
        padding: SPACING.m,
    },
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.m,
        padding: SPACING.m,
        marginBottom: SPACING.m,
        ...SHADOWS.small,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.s,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    date: {
        ...FONTS.caption,
        marginLeft: SPACING.xs,
    },
    calorieBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFBEB',
        paddingHorizontal: SPACING.s,
        paddingVertical: 4,
        borderRadius: RADIUS.full,
    },
    calorieText: {
        ...FONTS.caption,
        fontWeight: '700',
        color: COLORS.warning,
        marginLeft: 4,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: SPACING.s,
    },
    foodRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.s,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: SPACING.s,
    },
    foodName: {
        ...FONTS.body,
        color: COLORS.text,
        fontWeight: '500',
    },
    portion: {
        ...FONTS.caption,
        marginLeft: SPACING.xs,
    },
    healthTag: {
        fontSize: 12,
        fontWeight: '600',
    },
    tipContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.xs,
        backgroundColor: '#ECFDF5',
        padding: SPACING.s,
        borderRadius: RADIUS.s,
    },
    tipText: {
        fontSize: 12,
        color: COLORS.primary,
        marginLeft: SPACING.s,
        flex: 1,
        fontStyle: 'italic',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.6,
    },
    emptyText: {
        ...FONTS.h2,
        color: COLORS.textSecondary,
        marginTop: SPACING.m,
    },
    emptySubtext: {
        ...FONTS.body,
        marginTop: SPACING.xs,
    }
});
