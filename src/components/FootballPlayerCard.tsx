import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../styles/colors';
import { Ionicons } from '@expo/vector-icons';

interface FootballPlayerCardProps {
    player: any;
    onPress?: () => void;
    isFavorite?: boolean;
    onFavoritePress?: () => void;
}

export default function FootballPlayerCard({ player, onPress, isFavorite, onFavoritePress }: FootballPlayerCardProps) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
            <Image source={{ uri: player.image }} style={styles.avatar} />
            <TouchableOpacity
                style={styles.favoriteButton}
                onPress={e => {
                    e.stopPropagation();
                    onFavoritePress && onFavoritePress();
                }}
                activeOpacity={0.7}
            >
                <Ionicons
                    name={isFavorite ? 'heart' : 'heart-outline'}
                    size={18}
                    color={isFavorite ? colors.danger : colors.text.secondary}
                />
            </TouchableOpacity>
            <View style={styles.info}>
                <Text style={styles.name}>{player.playerName}</Text>
                <Text style={styles.team}>{player.team}</Text>
                <View style={styles.row}>
                    <Text style={styles.position}>{player.position}</Text>
                    {player.isCaptain && <Text style={styles.captain}>C</Text>}
                </View>
                <View style={styles.progressBar}>
                    <View style={[styles.progress, { width: `${player.PassingAccuracy * 100}%` }]} />
                </View>
                <Text style={styles.accuracy}>Passing: {(player.PassingAccuracy * 100).toFixed(0)}%</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
        shadowColor: colors.shadow,
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
        position: 'relative',
    },
    avatar: {
        width: 72, height: 72, borderRadius: 36, borderWidth: 3, borderColor: colors.primary,
        marginRight: 16,
        backgroundColor: colors.surface,
    },
    favoriteButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.shadow,
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 2,
        zIndex: 2,
    },
    info: { flex: 1 },
    name: { fontSize: 18, fontWeight: 'bold', color: colors.text.primary },
    team: { fontSize: 14, color: colors.secondary, marginBottom: 4 },
    row: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    position: { fontSize: 13, color: colors.text.secondary, marginRight: 8 },
    captain: { backgroundColor: colors.primary, color: '#fff', borderRadius: 8, paddingHorizontal: 6, fontWeight: 'bold', fontSize: 12 },
    progressBar: { height: 6, backgroundColor: colors.border, borderRadius: 3, marginVertical: 6, overflow: 'hidden' },
    progress: { height: 6, backgroundColor: colors.success, borderRadius: 3 },
    accuracy: { fontSize: 12, color: colors.success, fontWeight: 'bold' },
}); 