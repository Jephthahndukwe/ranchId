import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Alert,
  ScrollView,
} from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ScanLivestockScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedTagId, setScannedTagId] = useState('');

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    if (!data) {
      Alert.alert('Error', 'No barcode data detected');
      return;
    }

    setScanned(true);
    setScannedTagId(data);
    
    // Store the scanned tag ID in AsyncStorage
    try {
      await AsyncStorage.setItem('scannedTagId', data);
      // Clear the state before navigating
      setScanned(false);
      setScannedTagId('');
      router.push('/(auth)/tagLiveStock/liveStockDetails');
      console.log('Scanned tag ID:', data);
    } catch (error) {
      console.error('Error storing scanned tag ID:', error);
      Alert.alert('Error', 'Failed to store tag ID');
    }
  };

  if (hasPermission === null) {
    return (
      <View className="flex-1 justify-center items-center bg-[#FAF7F1]">
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View className="flex-1 justify-center items-center bg-[#FAF7F1]">
        <Text className="text-center text-gray-600 px-4">
          No access to camera. Please enable camera permissions in settings.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#FAF7F1] py-4">

      {/* Header */}
      <TouchableOpacity
        className="flex-row items-center gap-3 bg-[#fff] p-5"
        onPress={() => router.back()}
      >
        <AntDesign name="left" size={10} color="black" />
        <Text className="text-[#282828] text-[24px] font-normal">Tag Livestock</Text>
      </TouchableOpacity>

      <ScrollView className="flex-1 px-4">
        <View className="mt-5">
          <Text className="text-[#282828] text-[24px] font-semibold">Step 01/03</Text>
          <Text className="text-[#5B626C] text-[18px] font-medium mt-2">
            Scan Livestock Tag
          </Text>
        </View>

        {/* Camera Scanner */}
        <View className="flex-1 justify-center items-center mt-16">
          <View className="rounded-lg overflow-hidden bg-black w-full h-96">
            {!scanned ? (
              <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                  barcodeTypes: ["qr", "pdf417", "code128", "code39", "ean13", "ean8"],
                }}
              />
            ) : (
              <View className="flex-1 justify-center items-center">
                {/* <Image 
                source={require('./assets/cow-placeholder.png')} // You'll need to add this image
                className="w-48 h-48 rounded-lg"
                style={{ backgroundColor: '#e5e7eb' }}
              /> */}
              </View>
            )}

            {/* Scanner Overlay */}
            <View className="absolute inset-0 justify-center items-center">
              <View className="w-64 h-64 border-2 border-white border-dashed rounded-lg" />
            </View>
          </View>

        </View>
          {/* Scanned Tag ID Display */}
          {scannedTagId && (
            <View className="mt-4 bg-white p-4 rounded-lg flex-1 flex-row items-center gap-1">
              <Text className="text-[14px] text-gray-600">Scanned Tag ID:</Text>
              <Text className="text-lg font-semibold">{scannedTagId}</Text>
            </View>
          )}

        {/* Next Button */}
        <View className="mt-12">
          <TouchableOpacity
            className={`py-5 rounded-lg ${scannedTagId ? 'bg-blue-600' : 'bg-gray-300'}`}
            onPress={() => {
              if (scannedTagId) {
                // Clear the state before navigating
                setScanned(false);
                setScannedTagId('');
                router.push('/(auth)/tagLiveStock/liveStockDetails');
              } else {
                Alert.alert('Please scan your livestock barcode first to proceed');
              }
            }}
            // disabled={!scannedData}
          >
            <Text className={`text-center font-semibold ${scannedTagId ? 'text-white' : 'text-gray-500'}`}>
              Next
            </Text>
          </TouchableOpacity>
        </View>

        {/* Rescan Button */}
        {scanned && (
          <View className="px-4 pb-4">
            <TouchableOpacity
              className="py-3 border border-blue-600 rounded-lg"
              onPress={() => {
                setScanned(false);
                setScannedTagId('');
              }}
            >
              <Text className="text-center text-blue-600 font-medium">Scan Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ScanLivestockScreen;