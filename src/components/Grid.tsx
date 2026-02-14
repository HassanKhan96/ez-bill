
import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { wp } from '../constants/layout';

interface GridProps {
    children: ReactNode;
    columns?: number;
    gap?: number;
    style?: ViewStyle;
}

const Grid = ({ children, columns = 2, gap = 10, style }: GridProps) => {
    return (
        <View style={[styles.container, { gap }, style]}>
            {React.Children.map(children, (child) => (
                <View style={{ width: wp(100) / columns - (gap * (columns + 1)) / columns }}>
                    {child}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});

export default Grid;
