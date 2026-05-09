import Button from '@/components/Button/Button';
import OrbiAvatar from '@/components/OrbiAvatar/OrbiAvatar';
import Colors from '@/constants/colors';
import { globalStyles } from '@/constants/globalStyles';
import { authService } from '@/services/authService';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    StyleSheet, Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function CompanyCode() {
    const [manualCode, setManualCode] = useState('');
    const [cameraOpen, setCameraOpen] = useState(false);
    const [scanned, setScanned] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();

    const extractCode = (data: string): string | null => {
        // Formato do QR: "ID:ABC123;CMP:NomeDaEmpresa"
        const match = data.match(/ID:([^;]+)/);
        if (match) return match[1].trim();

        // Fallback: código digitado manualmente
        const isRawCode = /^[A-Z0-9-]{4,20}$/i.test(data.trim());
        return isRawCode ? data.trim().toUpperCase() : null;
    };

    const handleQRScanned = ({ data }: { data: string }) => {
        if (scanned) return;
        setScanned(true);
        setCameraOpen(false);

        const code = extractCode(data);
        if (!code) {
            Alert.alert('QR inválido', 'Este QR Code não pertence ao Orbita.');
            setScanned(false);
            return;
        }

        goToRegister(code);
    };

    const handleManualSubmit = () => {
        const code = manualCode.trim().toUpperCase();
        if (!code) return;
        goToRegister(code);
    };

    const goToRegister = async (code: string) => {
        try {
            const company = await authService.getCompanyByCode(code);
            console.log('company encontrada:', company); // debug
            router.push({
                pathname: '/auth/register',
                params: {
                    companyId: company.id,
                    companyName: company.name,
                },
            });
        } catch (error) {
            console.log('erro lookup:', error); // debug
            Alert.alert('Código inválido', 'Não encontramos uma empresa com esse código.');
            setScanned(false);
            setManualCode('');
        }
    };


    const openCamera = async () => {
        if (!permission?.granted) {
            const { granted } = await requestPermission();
            if (!granted) {
                Alert.alert('Permissão necessária', 'Precisamos acessar sua câmera para ler o QR Code.');
                return;
            }
        }
        setScanned(false);
        setCameraOpen(true);
    };

    return (
        <View style={styles.container}>
            <OrbiAvatar size={120} />

            <Text style={[globalStyles.title2, styles.title]}>Identificar Empresa</Text>
            <Text style={[globalStyles.text1, styles.description]}>
                Escaneie o QR Code da sua empresa ou digite o código fornecido pelo administrador.
            </Text>

            {/* Botão de câmera — estilo nativo/limpo */}
            <TouchableOpacity style={styles.qrButton} onPress={openCamera}>
                <Ionicons name="qr-code-outline" size={28} color={Colors.teal.base} />
                <Text style={[globalStyles.text1, styles.qrButtonText]}>Escanear QR Code</Text>
                <Ionicons name="chevron-forward" size={20} color={Colors.teal.base} />
            </TouchableOpacity>

            <Text style={[globalStyles.label2, styles.orText]}>ou digite o código</Text>

            <TextInput
                style={styles.input}
                placeholder="Ex: ACME-4821"
                placeholderTextColor={Colors.black[300]}
                value={manualCode}
                onChangeText={setManualCode}
                autoCapitalize="characters"
                returnKeyType="done"
                onSubmitEditing={handleManualSubmit}
            />

            <View style={styles.buttonContainer}>
                <Button
                    label="Continuar"
                    onPress={handleManualSubmit}
                    disabled={!manualCode.trim()}
                />
            </View>

            <Text style={[globalStyles.text2, styles.loginText]}>
                Já tem conta?{' '}
                <Text style={styles.link} onPress={() => router.push('/auth/login')}>
                    Entrar
                </Text>
            </Text>

            {/* Modal da câmera — fullscreen nativo */}
            <Modal visible={cameraOpen} animationType="slide" statusBarTranslucent>
                <View style={styles.cameraContainer}>
                    <CameraView
                        style={StyleSheet.absoluteFillObject}
                        facing="back"
                        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                        onBarcodeScanned={handleQRScanned}
                    />

                    {/* Overlay de mira */}
                    <View style={styles.overlay}>
                        <Text style={styles.overlayTitle}>Aponte para o QR Code</Text>
                        <View style={styles.scanArea} />
                        <Text style={styles.overlayHint}>da sua empresa</Text>
                    </View>


                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setCameraOpen(false)}
                    >
                        <Ionicons name="close" size={28} color={Colors.white[300]} />
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const SCAN_SIZE = 240;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white[300],
        paddingHorizontal: 32,
        justifyContent: 'center',
    },
    title: {
        color: Colors.teal.base,
        textAlign: 'center',
        marginTop: 24,
        marginBottom: 8,
    },
    description: {
        color: Colors.black.base,
        textAlign: 'center',
        opacity: 0.7,
        marginBottom: 36,
        lineHeight: 22,
    },
    qrButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white[300],
        borderWidth: 1,
        borderColor: Colors.teal.base,
        borderRadius: 12,
        padding: 16,
        gap: 12,
        marginBottom: 24,
    },
    qrButtonText: {
        flex: 1,
        color: Colors.teal.base,
        fontWeight: '600',
    },
    orText: {
        textAlign: 'center',
        color: Colors.black[300],
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.black[300],
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        color: Colors.black.base,
        letterSpacing: 2,
        marginBottom: 8,
    },
    buttonContainer: {
        marginTop: 16,
        marginBottom: 24,
    },
    loginText: {
        color: Colors.black.base,
        textAlign: 'center',
    },
    link: {
        color: Colors.teal.base,
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
    // Camera
    cameraContainer: {
        flex: 1,
        backgroundColor: 'black',
    },
    overlay: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
    },
    overlayTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    overlayHint: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
    },
    scanArea: {
        width: SCAN_SIZE,
        height: SCAN_SIZE,
        borderWidth: 2,
        borderColor: Colors.teal.base,
        borderRadius: 16,
        backgroundColor: 'transparent',
    },
    closeButton: {
        position: 'absolute',
        top: 56,
        right: 24,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        padding: 8,
    },
});