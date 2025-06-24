import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Player } from '../types';
import { colors } from '../styles/colors';
import { spacing } from '../styles/spacing';
import { Ionicons } from '@expo/vector-icons';

interface GeminiPlayerAnalysisProps {
    player: Player;
}

export default function GeminiPlayerAnalysis({ player }: GeminiPlayerAnalysisProps) {
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const API_KEY = 'AIzaSyA4WXJJ4VqHscNrCvycykQQL-d-vL78T0I';
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    useEffect(() => {
        let isMounted = true;
        async function fetchAnalysis() {
            setLoading(true);
            setError(null);
            setResult(null);
            try {
                const prompt = `Phân tích ngắn gọn (dưới 50 từ) phong độ, điểm mạnh và điểm yếu của cầu thủ bóng đá tên là ${player.playerName}, vị trí ${player.position}, đội ${player.team}.`;
                const res = await fetch(GEMINI_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                    }),
                });
                const data = await res.json();
                if (isMounted && data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
                    setResult(data.candidates[0].content.parts[0].text);
                } else if (isMounted) {
                    setError('No response from AI.');
                }
            } catch (e) {
                if (isMounted) setError('Error connecting to AI.');
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        fetchAnalysis();
        return () => { isMounted = false; };
    }, [player]);

    // Calculate age
    const age = new Date().getFullYear() - player.YoB;

    return (
        <View style={styles.card}>
            <Text style={styles.title}>AI Analyst</Text>
            {/* Player Stats Row */}
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Ionicons name="people" size={18} color={colors.secondary} />
                    <Text style={styles.statLabel}>Team</Text>
                    <Text style={styles.statValue}>{player.team}</Text>
                </View>
                <View style={styles.statItem}>
                    <Ionicons name="football" size={18} color={colors.primary} />
                    <Text style={styles.statLabel}>Position</Text>
                    <Text style={styles.statValue}>{player.position}</Text>
                </View>
                <View style={styles.statItem}>
                    <Ionicons name="time" size={18} color={colors.info} />
                    <Text style={styles.statLabel}>Minutes</Text>
                    <Text style={styles.statValue}>{player.MinutesPlayed}</Text>
                </View>
                <View style={styles.statItem}>
                    <Ionicons name="trending-up" size={18} color={colors.success} />
                    <Text style={styles.statLabel}>Passing</Text>
                    <Text style={[styles.statValue, { color: colors.success }]}>{(player.PassingAccuracy * 100).toFixed(0)}%</Text>
                </View>
                <View style={styles.statItem}>
                    <Ionicons name="star" size={18} color={player.isCaptain ? colors.warning : colors.border} />
                    <Text style={styles.statLabel}>Captain</Text>
                    <Text style={[styles.statValue, player.isCaptain ? styles.captainYes : styles.captainNo]}>{player.isCaptain ? 'Yes' : 'No'}</Text>
                </View>
                <View style={styles.statItem}>
                    <Ionicons name="calendar" size={18} color={colors.info} />
                    <Text style={styles.statLabel}>Age</Text>
                    <Text style={styles.statValue}>{age}</Text>
                </View>
            </View>
            {/* AI Analysis */}
            <View style={styles.analysisBox}>
                {loading && (
                    <View style={styles.centerRow}>
                        <ActivityIndicator color={colors.primary} size="small" />
                        <Text style={styles.loadingText}>Analyzing...</Text>
                    </View>
                )}
                {error && <Text style={styles.error}>{error}</Text>}
                {result && <Text style={styles.result}>{result}</Text>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: spacing.lg,
        marginHorizontal: spacing.lg,
        marginTop: spacing.xl,
        marginBottom: spacing.lg,
        shadowColor: colors.shadow,
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        color: colors.primary,
        marginBottom: 10,
        textAlign: 'center',
        letterSpacing: 1,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
        flexWrap: 'wrap',
        gap: 8,
    },
    statItem: {
        alignItems: 'center',
        minWidth: 60,
        marginHorizontal: 2,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 11,
        color: colors.text.secondary,
        marginTop: 2,
    },
    statValue: {
        fontSize: 13,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginTop: 1,
    },
    captainYes: {
        color: colors.warning,
    },
    captainNo: {
        color: colors.border,
    },
    analysisBox: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: spacing.md,
        minHeight: 48,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.shadow,
        shadowOpacity: 0.04,
        shadowRadius: 2,
        elevation: 1,
    },
    centerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    loadingText: {
        marginLeft: 8,
        color: colors.info,
        fontStyle: 'italic',
    },
    error: {
        color: colors.danger,
        fontStyle: 'italic',
        marginTop: 4,
    },
    result: {
        color: colors.text.primary,
        marginTop: 4,
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'center',
    },
}); 