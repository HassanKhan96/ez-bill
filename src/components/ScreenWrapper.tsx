
import React, { ReactNode } from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../theme/theme';

interface ScreenWrapperProps {
    children: ReactNode;
    bg?: string;
}

const ScreenWrapper = ({ children, bg = COLORS.background }: ScreenWrapperProps) => {
    const { top } = useSafeAreaInsets();
    const paddingTop = Platform.OS === 'ios' ? top : StatusBar.currentHeight || 0;

    return (
        <View style={[styles.container, { backgroundColor: bg, paddingTop }]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default ScreenWrapper;
