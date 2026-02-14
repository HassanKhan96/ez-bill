
import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { COLORS, SIZES } from '../theme/theme';
import { hp } from '../constants/layout';

interface CustomInputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
}

const CustomInput = ({
    label,
    error,
    containerStyle,
    style,
    ...props
}: CustomInputProps) => {
    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    error ? styles.inputError : null,
                    style,
                ]}
                placeholderTextColor={COLORS.textLight}
                {...props}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: hp(2),
    },
    label: {
        fontSize: SIZES.font,
        color: COLORS.text,
        marginBottom: hp(0.5),
        fontWeight: '500',
    },
    input: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: SIZES.radius,
        paddingHorizontal: SIZES.medium,
        paddingVertical: hp(1.2),
        fontSize: SIZES.font,
        color: COLORS.text,
    },
    inputError: {
        borderColor: COLORS.error,
    },
    errorText: {
        color: COLORS.error,
        fontSize: SIZES.small,
        marginTop: hp(0.5),
    },
});

export default CustomInput;
