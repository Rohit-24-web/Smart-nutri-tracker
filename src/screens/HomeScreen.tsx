
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { COLORS, SPACING, RADIUS, SHADOWS, FONTS } from '../constants/theme';
import { getHistory, HistoryItem } from '../services/storageService';

export const HomeScreen = ({ navigation }: any) => {
  const [todayCalories, setTodayCalories] = useState(0);
  const [recentMeals, setRecentMeals] = useState<HistoryItem[]>([]);
  const isFocused = useIsFocused();
  const DAILY_GOAL = 2200;

  useEffect(() => {
    if (isFocused) {
      loadDashboardData();
    }
  }, [isFocused]);

  const loadDashboardData = async () => {
    const history = await getHistory();

    // 1. Calculate Today's Calories
    const today = new Date().toDateString();
    const todaysMeals = history.filter(item => new Date(item.date).toDateString() === today);
    const calories = todaysMeals.reduce((sum, item) => sum + item.totalCalories, 0);
    setTodayCalories(Math.round(calories));

    // 2. Get Recent Activity (Top 3)
    setRecentMeals(history.slice(0, 3));
  };

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning ☀️';
    if (hours < 18) return 'Good Afternoon 🌤️';
    return 'Good Evening 🌙';
  };

  const progressPercent = Math.min((todayCalories / DAILY_GOAL) * 100, 100);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.username}>Rohit</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn}>
          <Ionicons name="person-circle-outline" size={40} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Daily Summary Card */}
        <LinearGradient
          colors={COLORS.primaryGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.summaryCard}
        >
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Calories Today</Text>
            <Text style={styles.summaryGoal}>Goal: {DAILY_GOAL}</Text>
          </View>

          <View style={styles.calorieRow}>
            <Text style={styles.calorieCount}>{todayCalories}</Text>
            <Text style={styles.calorieUnit}>kcal</Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(DAILY_GOAL - todayCalories)} kcal remaining</Text>
        </LinearGradient>

        {/* Action Grid */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={[styles.actionCard, styles.scanCard]}
            onPress={() => navigation.navigate('Camera')}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="scan-circle" size={32} color={COLORS.primary} />
            </View>
            <Text style={styles.actionText}>Scan Meal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('History')}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="journal" size={28} color={COLORS.secondary} />
            </View>
            <Text style={styles.actionText}>Log</Text>
          </TouchableOpacity>

          {/* Stub action for future "Analytics" */}
          <TouchableOpacity style={styles.actionCard} onPress={() => { }}>
            <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="bar-chart" size={28} color={COLORS.warning} />
            </View>
            <Text style={styles.actionText}>Stats</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Meals</Text>
          {recentMeals.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No meals tracked today yet.</Text>
              <Text style={styles.emptySubtext}>Tap "Scan Meal" to get started!</Text>
            </View>
          ) : (
            recentMeals.map((item) => (
              <View key={item.id} style={styles.recentItem}>
                <View style={styles.recentIcon}>
                  <Ionicons name="fast-food-outline" size={24} color={COLORS.textSecondary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.recentName} numberOfLines={1}>
                    {item.items.map(f => f.name).join(", ")}
                  </Text>
                  <Text style={styles.recentTime}>
                    {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                <Text style={styles.recentCalories}>{Math.round(item.totalCalories)}</Text>
              </View>
            ))
          )}
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.l,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.m,
    backgroundColor: COLORS.surface,
  },
  greeting: {
    ...FONTS.body,
    fontSize: 14,
  },
  username: {
    ...FONTS.h2,
    color: COLORS.text,
  },
  profileBtn: {
    padding: SPACING.xs,
  },
  scrollContent: {
    padding: SPACING.m,
  },
  summaryCard: {
    borderRadius: RADIUS.l,
    padding: SPACING.l,
    marginBottom: SPACING.xl,
    ...SHADOWS.medium,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.s,
  },
  summaryTitle: {
    ...FONTS.body,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  summaryGoal: {
    ...FONTS.caption,
    color: 'rgba(255,255,255,0.8)',
  },
  calorieRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: SPACING.m,
  },
  calorieCount: {
    fontSize: 48,
    fontWeight: '800',
    color: 'white',
  },
  calorieUnit: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginLeft: SPACING.xs,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: RADIUS.full,
    marginBottom: SPACING.s,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: RADIUS.full,
  },
  progressText: {
    ...FONTS.caption,
    color: 'white',
    textAlign: 'right',
  },
  sectionTitle: {
    ...FONTS.h2,
    fontSize: 18,
    marginBottom: SPACING.m,
    color: COLORS.text,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  actionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.m,
    padding: SPACING.m,
    width: '30%',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  scanCard: {
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  actionText: {
    ...FONTS.caption,
    fontWeight: '600',
    color: COLORS.text,
  },
  recentSection: {
    marginBottom: 40,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.m,
    borderRadius: RADIUS.m,
    marginBottom: SPACING.s,
    ...SHADOWS.small,
  },
  recentIcon: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.s,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  recentName: {
    ...FONTS.body,
    fontWeight: '600',
    color: COLORS.text,
  },
  recentTime: {
    ...FONTS.caption,
  },
  recentCalories: {
    ...FONTS.h2,
    fontSize: 16,
    color: COLORS.primary,
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.xl,
    opacity: 0.6,
  },
  emptyText: {
    ...FONTS.body,
    fontWeight: '600',
  },
  emptySubtext: {
    ...FONTS.caption,
    marginTop: SPACING.xs,
  },
});
