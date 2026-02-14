
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';
import { hp, wp } from '../constants/layout';

interface CustomButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    type?: 'primary' | 'secondary' | 'outline' | 'danger';
    style?: ViewStyle;
    textStyle?: TextStyle;
}

const CustomButton = ({
    title,
    onPress,
    loading = false,
    disabled = false,
    type = 'primary',
    style,
    textStyle,
}: CustomButtonProps) => {
    const getBackgroundColor = () => {
        if (disabled) return COLORS.textLight;
        switch (type) {
            case 'primary': return COLORS.primary;
            case 'secondary': return COLORS.secondary;
            case 'danger': return COLORS.error;
            case 'outline': return 'transparent';
            default: return COLORS.primary;
        }
    };

    const getTextColor = () => {
        if (type === 'outline') return COLORS.primary;
        return COLORS.white;
    };

    const getBorder = () => {
        if (type === 'outline') return { borderWidth: 1, borderColor: COLORS.primary };
        return {};
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
            style={[
                styles.button,
                { backgroundColor: getBackgroundColor() },
                getBorder(),
                style,
                type !== 'outline' && SHADOWS.medium,
                disabled && { elevation: 0, shadowOpacity: 0 },
            ]}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(5),
        borderRadius: SIZES.radius,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    text: {
        fontSize: SIZES.medium,
        fontWeight: '600',
    },
});

export default CustomButton;
