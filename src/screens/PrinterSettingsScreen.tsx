
import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    PermissionsAndroid,
    Platform,
} from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';
import { hp } from '../constants/layout';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
    getPairedDevices,
    connect,
    disconnect,
    isConnected,
} from 'react-native-bt-thermal-printer';

interface PrinterDevice {
    name: string;
    address: string;
}

const PrinterSettingsScreen = () => {
    const navigation = useNavigation<any>();
    const [devices, setDevices] = useState<PrinterDevice[]>([]);
    const [loadingDevices, setLoadingDevices] = useState(false);
    const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
    const [connectingAddress, setConnectingAddress] = useState<string | null>(null);
    const [permissionsGranted, setPermissionsGranted] = useState(false);

    const requestBluetoothPermissions = useCallback(async (): Promise<boolean> => {
        if (Platform.OS !== 'android') {
            setPermissionsGranted(true);
            return true;
        }

        try {
            if (Platform.Version >= 31) {
                // Android 12+ — need BLUETOOTH_CONNECT + BLUETOOTH_SCAN
                const results = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                ]);
                const granted =
                    results['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
                    results['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED;
                if (!granted) {
                    Alert.alert(
                        'Bluetooth Permission Required',
                        'Please grant Bluetooth permissions in Settings to use the printer.',
                    );
                }
                setPermissionsGranted(granted);
                return granted;
            } else {
                // Android 11 and below — need ACCESS_FINE_LOCATION
                const result = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                );
                const granted = result === PermissionsAndroid.RESULTS.GRANTED;
                if (!granted) {
                    Alert.alert(
                        'Location Permission Required',
                        'Location permission is required to scan for Bluetooth devices on this Android version.',
                    );
                }
                setPermissionsGranted(granted);
                return granted;
            }
        } catch (error: any) {
            Alert.alert('Permission Error', error?.message || 'Failed to request Bluetooth permissions.');
            return false;
        }
    }, []);

    useEffect(() => {
        requestBluetoothPermissions();
    }, [requestBluetoothPermissions]);

    const handleLoadDevices = useCallback(async () => {
        // Re-request permissions if not yet granted
        const hasPermission = permissionsGranted || await requestBluetoothPermissions();
        if (!hasPermission) return;

        try {
            setLoadingDevices(true);
            const pairedDevices = await getPairedDevices();
            setDevices(pairedDevices);

            // Check if any device is already connected
            const connected = await isConnected();
            if (!connected) {
                setConnectedAddress(null);
            }
        } catch (error: any) {
            console.log(error)
            Alert.alert('Error', error?.message || 'Failed to load paired devices. Make sure Bluetooth is enabled.');
        } finally {
            setLoadingDevices(false);
        }
    }, []);

    const handleConnect = useCallback(async (device: PrinterDevice) => {
        try {
            setConnectingAddress(device.address);
            await connect(device.address);
            setConnectedAddress(device.address);
            Alert.alert('Connected', `Successfully connected to ${device.name}`);
        } catch (error: any) {
            Alert.alert('Connection Failed', error?.message || `Could not connect to ${device.name}`);
        } finally {
            setConnectingAddress(null);
        }
    }, []);

    const handleDisconnect = useCallback(async () => {
        try {
            setConnectingAddress(connectedAddress);
            await disconnect();
            setConnectedAddress(null);
        } catch (error: any) {
            Alert.alert('Error', error?.message || 'Failed to disconnect');
        } finally {
            setConnectingAddress(null);
        }
    }, [connectedAddress]);

    const renderDevice = ({ item }: { item: PrinterDevice }) => {
        const isThisConnected = item.address === connectedAddress;
        const isThisConnecting = item.address === connectingAddress;

        return (
            <View style={styles.deviceCard}>
                <View style={styles.deviceIcon}>
                    <Ionicons
                        name="print-outline"
                        size={24}
                        color={isThisConnected ? COLORS.success : COLORS.textLight}
                    />
                </View>
                <View style={styles.deviceInfo}>
                    <Text style={styles.deviceName} numberOfLines={1}>
                        {item.name || 'Unknown Device'}
                    </Text>
                    <Text style={styles.deviceAddress}>{item.address}</Text>
                    {isThisConnected && (
                        <View style={styles.connectedBadge}>
                            <Ionicons name="checkmark-circle" size={12} color={COLORS.success} />
                            <Text style={styles.connectedText}>Connected</Text>
                        </View>
                    )}
                </View>
                {isThisConnecting ? (
                    <ActivityIndicator size="small" color={COLORS.primary} />
                ) : isThisConnected ? (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.disconnectButton]}
                        onPress={handleDisconnect}
                    >
                        <Text style={styles.disconnectButtonText}>Disconnect</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleConnect(item)}
                        disabled={connectingAddress !== null}
                    >
                        <Text style={styles.actionButtonText}>Connect</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <ScreenWrapper>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Printer Settings</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Status Banner */}
            <View style={[styles.statusBanner, connectedAddress ? styles.statusBannerConnected : styles.statusBannerIdle]}>
                <Ionicons
                    name={connectedAddress ? 'bluetooth' : 'bluetooth-outline'}
                    size={18}
                    color={connectedAddress ? COLORS.success : COLORS.textLight}
                />
                <Text style={[styles.statusText, connectedAddress && styles.statusTextConnected]}>
                    {connectedAddress
                        ? `Printer connected`
                        : 'No printer connected'}
                </Text>
            </View>

            {/* Load Devices Button */}
            <View style={styles.loadButtonContainer}>
                <TouchableOpacity
                    style={styles.loadButton}
                    onPress={handleLoadDevices}
                    disabled={loadingDevices}
                >
                    {loadingDevices ? (
                        <ActivityIndicator size="small" color={COLORS.white} />
                    ) : (
                        <Ionicons name="refresh-outline" size={18} color={COLORS.white} />
                    )}
                    <Text style={styles.loadButtonText}>
                        {loadingDevices ? 'Scanning...' : 'Load Paired Devices'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Device List */}
            <FlatList
                data={devices}
                keyExtractor={(item) => item.address}
                renderItem={renderDevice}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    !loadingDevices ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="print-outline" size={64} color={COLORS.border} />
                            <Text style={styles.emptyTitle}>No Paired Devices</Text>
                            <Text style={styles.emptySubtitle}>
                                Pair your Bluetooth thermal printer in Android Settings, then tap "Load Paired Devices".
                            </Text>
                        </View>
                    ) : null
                }
            />
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: SIZES.padding,
        paddingVertical: hp(2),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backButton: {
        padding: SIZES.base,
        width: 40,
    },
    title: {
        fontSize: SIZES.large,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    statusBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: SIZES.padding,
        marginBottom: hp(2),
        paddingHorizontal: SIZES.medium,
        paddingVertical: hp(1),
        borderRadius: SIZES.radius,
        gap: 8,
    },
    statusBannerIdle: {
        backgroundColor: COLORS.border,
    },
    statusBannerConnected: {
        backgroundColor: '#D1FAE5', // light green
    },
    statusText: {
        fontSize: SIZES.font,
        color: COLORS.textLight,
        fontWeight: '500',
    },
    statusTextConnected: {
        color: COLORS.success,
    },
    loadButtonContainer: {
        paddingHorizontal: SIZES.padding,
        marginBottom: hp(2),
    },
    loadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.radius,
        paddingVertical: hp(1.5),
        gap: 8,
    },
    loadButtonText: {
        color: COLORS.white,
        fontWeight: '600',
        fontSize: SIZES.medium,
    },
    listContent: {
        paddingHorizontal: SIZES.padding,
        paddingBottom: hp(4),
    },
    deviceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radius,
        padding: SIZES.medium,
        marginBottom: SIZES.small,
        ...SHADOWS.light,
    },
    deviceIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.background,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SIZES.medium,
    },
    deviceInfo: {
        flex: 1,
    },
    deviceName: {
        fontSize: SIZES.medium,
        fontWeight: '600',
        color: COLORS.text,
    },
    deviceAddress: {
        fontSize: SIZES.font,
        color: COLORS.textLight,
        marginTop: 2,
    },
    connectedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 4,
    },
    connectedText: {
        fontSize: SIZES.font,
        color: COLORS.success,
        fontWeight: '500',
    },
    actionButton: {
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.base,
        paddingHorizontal: SIZES.medium,
        paddingVertical: SIZES.base,
    },
    actionButtonText: {
        color: COLORS.white,
        fontWeight: '600',
        fontSize: SIZES.font,
    },
    disconnectButton: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.error,
    },
    disconnectButtonText: {
        color: COLORS.error,
        fontWeight: '600',
        fontSize: SIZES.font,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: hp(8),
        paddingHorizontal: SIZES.padding,
    },
    emptyTitle: {
        fontSize: SIZES.large,
        fontWeight: '600',
        color: COLORS.text,
        marginTop: SIZES.medium,
    },
    emptySubtitle: {
        fontSize: SIZES.font,
        color: COLORS.textLight,
        textAlign: 'center',
        marginTop: SIZES.small,
        lineHeight: 20,
    },
});

export default PrinterSettingsScreen;
