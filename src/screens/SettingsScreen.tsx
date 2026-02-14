
import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { COLORS, SIZES } from '../theme/theme';
import { hp } from '../constants/layout';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const SettingsScreen = () => {
    const [storeName, setStoreName] = React.useState('Ez-Bill Store');
    const [isDarkMode, setIsDarkMode] = React.useState(false);

    const handleSave = () => {
        // Save settings logic here
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
    footer: {
        marginTop: 'auto',
    },
});

export default SettingsScreen;
