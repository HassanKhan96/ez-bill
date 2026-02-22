
import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';
import { hp } from '../constants/layout';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
    const navigation = useNavigation<any>();
    const [storeName, setStoreName] = React.useState('Ez-Bill Store');
    const [isDarkMode, setIsDarkMode] = React.useState(false);

    const handleSave = () => {
        console.log('Settings saved:', { storeName, isDarkMode });
    };

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <Text style={styles.title}>Settings</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Store Information</Text>
                    <CustomInput
                        label="Store Name"
                        value={storeName}
                        onChangeText={setStoreName}
                        placeholder="Enter store name"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Dark Mode</Text>
                        <Switch
                            value={isDarkMode}
                            onValueChange={setIsDarkMode}
                            trackColor={{ false: COLORS.border, true: COLORS.primary }}
                            thumbColor={COLORS.white}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Hardware</Text>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('PrinterSettings')}
                        activeOpacity={0.7}
                    >
                        <View style={styles.menuItemLeft}>
                            <View style={styles.menuIconContainer}>
                                <Ionicons name="print-outline" size={20} color={COLORS.primary} />
                            </View>
                            <View>
                                <Text style={styles.menuItemTitle}>Printer Settings</Text>
                                <Text style={styles.menuItemSubtitle}>Connect Bluetooth thermal printer</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <CustomButton title="Save Changes" onPress={handleSave} />
                </View>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: SIZES.padding,
    },
    title: {
        fontSize: SIZES.extraLarge,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: hp(3),
    },
    section: {
        marginBottom: hp(4),
    },
    sectionTitle: {
        fontSize: SIZES.large,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: hp(2),
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: hp(1),
    },
    label: {
        fontSize: SIZES.medium,
        color: COLORS.text,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radius,
        padding: SIZES.medium,
        ...SHADOWS.light,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SIZES.medium,
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuItemTitle: {
        fontSize: SIZES.medium,
        fontWeight: '600',
        color: COLORS.text,
    },
    menuItemSubtitle: {
        fontSize: SIZES.font,
        color: COLORS.textLight,
        marginTop: 2,
    },
    footer: {
        marginTop: 'auto',
    },
});

export default SettingsScreen;
