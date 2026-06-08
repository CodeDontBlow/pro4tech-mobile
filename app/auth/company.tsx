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
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CompanyCode() {
    const insets = useSafeAreaInsets();
    const [codeError, setCodeError] = useState('');
    const [manualCode, setManualCode] = useState('');
    const [cameraOpen, setCameraOpen] = useState(false);
    const [codeOpen, setCodeOpen] = useState(false);
    const [scanned, setScanned] = useState(false);
    const [companyError, setCompanyError] = useState('');
    const [permission, requestPermission] = useCameraPermissions();

    const extractCode = (data: string): string | null => {
        // formato do QR: "ID:ABC123;CMP:NomeDaEmpresa"
        const match = data.match(/ID:([^;]+)/);
        if (match) return match[1].trim();

        // fallback: código digitado manualmente
        const isRawCode = /^[A-Z0-9-]{4,20}$/i.test(data.trim());
        return isRawCode ? data.trim().toUpperCase() : null;
    };

    const handleQRScanned = ({ data }: { data: string }) => {
        if (scanned) return;
        setScanned(true);
        setCompanyError('');

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
        setCompanyError('');
        goToRegister(code);
    };

    const goToRegister = async (code: string) => {
        try {
            const company = await authService.getCompanyByCode(code);
            setCompanyError('');
            setCameraOpen(false);
            setCodeOpen(false);
            router.push({
                pathname: '/auth/register',
                params: {
                    companyId: company.id,
                    companyName: company.name,
                },
            });
        } catch (error) {
            setCompanyError('Empresa não encontrada');
            setScanned(false);
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
        setCompanyError('');
        setScanned(false);
        setCodeOpen(false);  // fecha o de código se estiver aberto
        setCameraOpen(true);
    };
    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}> 
            <OrbiAvatar variant="elipse" size={180} />
            <Text style={[globalStyles.title2, styles.title]}>Identificar Empresa</Text>
            <Text style={[globalStyles.text1, styles.description]}>
                Escaneie o QR Code da sua empresa ou digite o código fornecido pelo administrador.
            </Text>

            {/* Botão câmera */}
            <TouchableOpacity style={styles.qrButton} onPress={openCamera}>
                <Ionicons name="qr-code-outline" size={28} color={Colors.white[300]} />
                <Text style={[globalStyles.text1, styles.qrButtonText]}>Escanear QR Code</Text>
                <Ionicons name="chevron-forward" size={20} color={Colors.white[300]} />
            </TouchableOpacity>

            {/* Botão código manual */}
            <TouchableOpacity
                style={styles.codeButton}
                onPress={() => {
                    setCompanyError('');
                    setCodeOpen(true);
                }}
            >
                <Ionicons name="pencil-outline" size={28} color={Colors.white[300]} />
                <Text style={[globalStyles.text1, styles.codeButtonText]}>Entrar com código</Text>
                <Ionicons name="chevron-forward" size={20} color={Colors.white[300]} />
            </TouchableOpacity>

            <Text style={[globalStyles.text2, styles.loginText]}>
                Já tem conta?{' '}
                <Text style={styles.link} onPress={() => router.push('/auth/login')}>
                    Entrar
                </Text>
            </Text>

            {/* Modal — Câmera */}
            <Modal visible={cameraOpen} animationType="slide" statusBarTranslucent>

                <View style={styles.cameraContainer}>
                    <OrbiAvatar variant="camera" size={160} />
                    <View style={styles.cameraBox}>
                        <CameraView
                            style={styles.camera}
                            facing="back"
                            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                            onBarcodeScanned={handleQRScanned}
                        />
                        <View style={styles.scanOverlay}>
                            <View style={styles.scanArea} />
                        </View>
                    </View>

                    <Text style={styles.titleQR}>
                        Escaneie o QR Code para começar a configurar seu perfil.
                    </Text>

                    {!!companyError && (
                        <Text style={styles.errorText}>{companyError}</Text>
                    )}


                    <Button variant="primary"
                        label="Entrar com código manual"
                        onPress={() => { setCameraOpen(false); setCompanyError(''); setCodeOpen(true); }}>
                    </Button>

                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => {
                            setCompanyError('');
                            setCameraOpen(false);
                        }}
                    >
                        <Ionicons name="close" size={28} color={Colors.white[300]} />
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* Modal — Código manual */}
            <Modal visible={codeOpen} animationType="slide" statusBarTranslucent>
                <View style={styles.codeContainer}>
                    <OrbiAvatar variant="white" size={160} />
                    <Text style={[globalStyles.title2, styles.codeTitle]}>
                        Digite o código para continuar
                    </Text>

                    {!!companyError && (
                        <Text style={styles.errorText}>{companyError}</Text>
                    )}

                    <TextInput
                        style={styles.input}
                        placeholder="Ex: ACME-4821"
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        value={manualCode}
                        onChangeText={setManualCode}
                        autoCapitalize="characters"
                        returnKeyType="done"
                        onSubmitEditing={handleManualSubmit}
                        autoFocus />

                    <Button variant="light"
                        label="Continuar"
                        onPress={handleManualSubmit}
                        disabled={!manualCode.trim()}
                    />

                    <Button label="Escanear QR Code" variant="primary"
                        onPress={() => { setCodeOpen(false); setCompanyError(''); openCamera(); }} />

                    <TouchableOpacity style={styles.closeButton} onPress={() => { setCompanyError(''); setCodeOpen(false); setManualCode(''); }}>
                        <Ionicons name="close" size={28} color={Colors.white[300]} />
                    </TouchableOpacity>
                </View>
            </Modal>
</SafeAreaView>
    );
}

const SCAN_SIZE = 240;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.teal[700],
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    title: {
        color: Colors.white[300],
        textAlign: 'center',
        marginTop: 24,
        marginBottom: 8,
    },
    description: {
        color: Colors.white[300],
        textAlign: 'center',
        opacity: 0.8,
        marginBottom: 36,
        lineHeight: 22,
    },
    errorText: {
        color: Colors.red.base,
        textAlign: 'center',
        marginTop: 12,
        marginBottom: 8,
    },
    qrButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.teal.base,
        borderRadius: 12,
        padding: 16,
        gap: 12,
        marginBottom: 12,
        width: '100%',
    },
    qrButtonText: {
        flex: 1,
        color: Colors.white[300],
        fontWeight: '600',
    },
    codeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.teal.base,
        borderRadius: 12,
        padding: 16,
        gap: 12,
        marginBottom: 32,
        width: '100%',
    },
    codeButtonText: {
        flex: 1,
        color: Colors.white[300],
        fontWeight: '600',
    },
    loginText: {
        color: Colors.white[300],
        textAlign: 'center',
    },
    link: {
        color: Colors.white[300],
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },

    // Modal câmera
    cameraContainer: {
        flex: 1,
        backgroundColor: Colors.teal[300],
        justifyContent: 'center',
        paddingHorizontal: 40,
        alignItems: 'center',
    },
    cameraBox: {
        width: 360,
        height: 360,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: Colors.black.base,
    },
    camera: {
        flex: 1,
    },
    scanOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanArea: {
        width: 365,
        height: 365,
        borderWidth: 12,
        borderColor: Colors.teal.base,
        borderRadius: 20,
        backgroundColor: 'transparent',
    },
    titleQR: {
        color: Colors.white[300],
        marginTop: 15,
        marginBottom: 30,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '500',
        paddingHorizontal: 60,
    },

    // Modal código
    codeContainer: {
        flex: 1,
        backgroundColor: Colors.teal[300],
        paddingHorizontal: 15,
        justifyContent: 'center',
    },
    codeTitle: {
        color: Colors.white[300],
        textAlign: 'center',
        marginBottom: 40,
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 14,
        backgroundColor: Colors.teal[500],
        fontSize: 18,
        color: Colors.white[300],
        letterSpacing: 4,
        marginBottom: 56,
        textAlign: 'center',
    },

    // Compartilhado
    closeButton: {
        position: 'absolute',
        top: 60,
        right: 24,
        borderRadius: 20,
        padding: 8,
    },
    continue: {
        backgroundColor: Colors.white[300],
        borderRadius: 20,
    },
    continueButtonText: {
        flex: 1,
        color: Colors.teal[300],
        fontWeight: '600',
    },
    textLink: {
        marginTop: 20,
        alignItems: 'center',
    },
    textLinkLabel: {
        color: Colors.white[300],
        textDecorationLine: 'underline',
        fontSize: 15,
        opacity: 0.85,
    },
});