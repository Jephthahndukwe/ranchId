import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Image,
    Alert,
    TextInput,
} from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CaptureVerification = () => {
    const [verificationData, setVerificationData] = useState({
        description: '',
        taggingLocation: '',
        commentsOtherLocation: '',
        weight: '',
        productionType: '',
        verificationPhoto: null,
        muzzlePhoto: null,
    });
    const [livestockData, setLivestockData] = useState({});

    useEffect(() => {
        // Load livestock data from AsyncStorage when component mounts
        const loadLivestockData = async () => {
            try {
                const data = await AsyncStorage.getItem('livestockData');
                if (data) {
                    setLivestockData(JSON.parse(data));
                }
            } catch (error) {
                console.error('Error loading livestock data:', error);
                Alert.alert('Error', 'Failed to load livestock data');
            }
        };

        loadLivestockData();
    }, []);

    const handleInputChange = (field, value) => {
        setVerificationData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleImagePicker = async (type) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            handleInputChange(type, result.assets[0].uri);
        }
    };

    const handleCameraCapture = async (type) => {
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            handleInputChange(type, result.assets[0].uri);
        }
    };

    const showImagePickerOptions = (type) => {
        Alert.alert(
            'Select Image',
            'Choose an option',
            [
                { text: 'Camera', onPress: () => handleCameraCapture(type) },
                { text: 'Gallery', onPress: () => handleImagePicker(type) },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    const handleNext = async () => {
        // Validate required fields
        if (!verificationData.taggingLocation || !verificationData.weight) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        // Combine all data
        const completeData = {
            ...livestockData,
            ...verificationData,
            scannedTagId: livestockData.scannedTagId || '',
            passportId: livestockData.passportId || '',
            livestockKeeper: livestockData.livestockKeeper || '',
            livestockOwner: livestockData.livestockOwner || '',
            livestockType: livestockData.livestockType || '',
            livestockBreed: livestockData.livestockBreed || '',
            gender: livestockData.gender || '',
            healthStatus: livestockData.healthStatus || '',
            dateOfBirth: livestockData.dateOfBirth || '',
            selectBirthPeriod: livestockData.selectBirthPeriod || '',
            description: verificationData.description || '',
            taggingLocation: verificationData.taggingLocation || '',
            comments: verificationData.commentsOtherLocation || '',
            weight: verificationData.weight || '',
            productionType: verificationData.productionType || '',
            verificationPhoto: verificationData.verificationPhoto || '',
            muzzlePhoto: verificationData.muzzlePhoto || '',
            commentsOtherLocation: verificationData.commentsOtherLocation || ''
        };

        try {
            // Store complete data in AsyncStorage
            await AsyncStorage.setItem('completeData', JSON.stringify(completeData));
            router.push('/(auth)/tagLiveStock/previewDetails');
        } catch (error) {
            console.error('Error storing complete data:', error);
            Alert.alert('Error', 'Failed to save verification data');
        }
    };

    const removeImage = (type) => {
        handleInputChange(type, null);
    };

    return (
        <SafeAreaView className="flex-1 bg-[#FAF7F1]">
            <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />

            {/* Header */}
            <TouchableOpacity
                className="flex-row items-center gap-3 bg-[#fff] p-5"
                onPress={() => router.back()}
            >
                <AntDesign name="left" size={10} color="black" />
                <Text className="text-[#282828] text-[24px] font-normal">Tag Livestock</Text>
            </TouchableOpacity>

            <View className="mt-3 px-4">
                <Text className="text-[#282828] text-[24px] font-semibold">Step 03/03</Text>
                <Text className="text-[#5B626C] text-[18px] font-medium mt-2">
                    Capture Verification Details
                </Text>
            </View>

            <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
                {/* Description */}
                <View className="mb-4">
                    <Text className="text-sm text-gray-600 mb-2">Description</Text>
                    <View className="bg-white border border-gray-300 rounded-lg px-2 min-h-[100px]">
                        <TextInput
                            className="text-sm text-gray-700"
                            placeholder="Enter a description..."
                            multiline
                            numberOfLines={4}
                            value={verificationData.description}
                            onChangeText={(value) => handleInputChange('description', value)}
                        />
                    </View>
                </View>

                {/* Tagging Location */}
                <View className="mb-4">
                    <Text className="text-sm text-gray-600 mb-2">Tagging Location</Text>
                    <View className="bg-white border border-gray-300 rounded-lg">
                        <Picker
                            selectedValue={verificationData.taggingLocation}
                            onValueChange={(value) => handleInputChange('taggingLocation', value)}
                            style={{ height: 50 }}
                        >
                            <Picker.Item label="Select location" value="" />
                            <Picker.Item label="Farm A" value="farm_a" />
                            <Picker.Item label="Farm B" value="farm_b" />
                            <Picker.Item label="Market" value="market" />
                            <Picker.Item label="Other" value="other" />
                        </Picker>
                    </View>
                </View>

                {/* Comments for other Location */}
                <View className="mb-4">
                    <Text className="text-sm text-gray-600 mb-2">Comments for other Location</Text>
                    <View className="bg-white border border-gray-300 rounded-lg px-2 min-h-[100px]">
                        <TextInput
                            className="text-sm text-gray-700"
                            placeholder="Enter comments..."
                            multiline
                            numberOfLines={4}
                            value={verificationData.commentsOtherLocation}
                            onChangeText={(value) => handleInputChange('commentsOtherLocation', value)}
                        />
                    </View>
                </View>

                {/* Row for Weight and Production Type */}
                <View className="flex-row mb-4 gap-3">
                    {/* Weight */}
                    <View className="flex-1">
                        <Text className="text-sm text-gray-600 mb-2">Weight</Text>
                        <View className="bg-white border border-gray-300 rounded-lg">
                            <Picker
                                selectedValue={verificationData.weight}
                                onValueChange={(value) => handleInputChange('weight', value)}
                                style={{ height: 50 }}
                            >
                                <Picker.Item label="Select" value="" />
                                <Picker.Item label="50-100 kg" value="50-100" />
                                <Picker.Item label="100-200 kg" value="100-200" />
                                <Picker.Item label="200-300 kg" value="200-300" />
                                <Picker.Item label="300+ kg" value="300+" />
                            </Picker>
                        </View>
                    </View>

                    {/* Production Type */}
                    <View className="flex-1">
                        <Text className="text-sm text-gray-600 mb-2">Production Type</Text>
                        <View className="bg-white border border-gray-300 rounded-lg">
                            <Picker
                                selectedValue={verificationData.productionType}
                                onValueChange={(value) => handleInputChange('productionType', value)}
                                style={{ height: 50 }}
                            >
                                <Picker.Item label="Select" value="" />
                                <Picker.Item label="Dairy" value="dairy" />
                                <Picker.Item label="Beef" value="beef" />
                                <Picker.Item label="Breeding" value="breeding" />
                            </Picker>
                        </View>
                    </View>
                </View>

                {/* Comments for other Location (Second) */}
                {/* <View className="mb-4">
                    <Text className="text-sm text-gray-600 mb-2">Comments for other Location</Text>
                    <View className="bg-white border border-gray-300 rounded-lg p-3 min-h-[80px]">
                        <Text className="text-gray-400 text-sm">Add comments here...</Text>
                    </View>
                </View> */}

                {/* Verification Photo */}
                <View className="mb-4">
                    <Text className="text-sm text-gray-600 mb-2">Verification Photo</Text>
                    {verificationData.verificationPhoto ? (
                        <View className="relative bg-white">
                            <Image
                                source={{ uri: verificationData.verificationPhoto }}
                                className="w-full h-40 rounded-lg"
                                resizeMode="cover"
                            />
                            <TouchableOpacity
                                className="absolute top-2 right-2 bg-red-500 rounded-full p-1"
                                onPress={() => removeImage('verificationPhoto')}
                            >
                                <Ionicons name="close" size={16} color="white" />
                            </TouchableOpacity>
                            <View className="absolute bottom-2 right-2 bg-black bg-opacity-50 px-2 py-1 rounded">
                                <Text className="text-white text-xs">Re-capture Portrait</Text>
                            </View>
                        </View>
                    ) : (
                        <TouchableOpacity
                            className="border-2 border-dashed border-gray-300 bg-white rounded-lg p-10 items-center justify-center"
                            onPress={() => showImagePickerOptions('verificationPhoto')}
                        >
                            <Ionicons name="camera-outline" size={40} color="#9CA3AF" />
                            <Text className="text-gray-500 mt-2 text-center">
                                Capture or select the required images. Images must be png, jpg or jpeg
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Muzzle Photo */}
                <View className="mb-12">
                    <Text className="text-sm text-gray-600 mb-2">Muzzle Photo</Text>
                    {verificationData.muzzlePhoto ? (
                        <View className="relative bg-white">
                            <Image
                                source={{ uri: verificationData.muzzlePhoto }}
                                className="w-full h-40 rounded-lg"
                                resizeMode="cover"
                            />
                            <TouchableOpacity
                                className="absolute top-2 right-2 bg-red-500 rounded-full p-1"
                                onPress={() => removeImage('muzzlePhoto')}
                            >
                                <Ionicons name="close" size={16} color="white" />
                            </TouchableOpacity>
                            <View className="absolute bottom-2 right-2 bg-black bg-opacity-50 px-2 py-1 rounded">
                                <Text className="text-white text-xs">Re-capture Portrait</Text>
                            </View>
                        </View>
                    ) : (
                        <TouchableOpacity
                            className="border-2 border-dashed border-gray-300 bg-white rounded-lg p-10 items-center justify-center"
                            onPress={() => showImagePickerOptions('muzzlePhoto')}
                        >
                            <Ionicons name="camera-outline" size={40} color="#9CA3AF" />
                            <Text className="text-gray-500 mt-2 text-center">
                                Capture or select the required images. Images must be png, jpg or jpeg
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>

            {/* Action Buttons */}
            <View className="p-5 bg-[#FAF7F1] border-t border-gray-200">
                <View className="flex-row gap-3">
                    <TouchableOpacity
                        className="flex-1 py-3 border border-gray-300 rounded-lg"
                        onPress={() => router.back()}
                    >
                        <Text className="text-center text-gray-600 font-medium">Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-1 py-3 bg-blue-600 rounded-lg"
                        onPress={handleNext}
                    >
                        <Text className="text-center text-white font-medium">Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default CaptureVerification;