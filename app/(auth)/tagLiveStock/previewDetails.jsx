import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Image,
    StatusBar,
    SafeAreaView,
} from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export default function TagLivestockScreen() {
    const { completeData } = useLocalSearchParams();
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const loadFormData = async () => {
            try {
                // First try to get from URL params
                if (completeData) {
                    setFormData(JSON.parse(completeData));
                    return;
                }
                
                // If not in URL params, try AsyncStorage
                const data = await AsyncStorage.getItem('completeData');
                if (data) {
                    const parsedData = JSON.parse(data);
                    setFormData(parsedData);
                }
            } catch (error) {
                console.error('Error loading form data:', error);
            }
        };
        loadFormData();
    }, [completeData]);

    const handleSubmit = async () => {
        // Clear AsyncStorage when submission is successful
        try {
            const tagId = formData.tagId || formData.scannedTagId;
            await AsyncStorage.multiRemove(['scannedTagId', 'livestockData', 'completeData']);
            router.push({
                pathname: '/(auth)/tagLiveStock/success',
                params: { tagId }
            });
        } catch (error) {
            console.error('Error clearing AsyncStorage:', error);
            Alert.alert('Error', 'Failed to clear data');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#FAF7F1] py-8">
            {/* Header */}
            <TouchableOpacity
                className="flex-row items-center gap-3 bg-[#fff] p-5"
                onPress={() => router.back()}
            >
                <AntDesign name="left" size={10} color="black" />
                <Text className="text-[#282828] text-[24px] font-normal">Tag Livestock</Text>
            </TouchableOpacity>

            <ScrollView className="flex-1 bg-[#FAF7F1]">
                <View className="p-4">
                    <View className="">
                        <Text className="text-[#282828] text-[24px] font-semibold">Step 03/03</Text>
                        <Text className="text-[#5B626C] text-[18px] font-medium mt-2">
                            Form Summary
                        </Text>
                    </View>
                    
                    {/* Form Fields */}
                    <View className="mt-5">
                        {/* Scanned Tag ID */}
                        <View className='mt-4'>
                            <Text className="text-[14px] text-gray-600 mb-1">Scanned Tag ID</Text>
                            <Text className="text-[18px] font-medium text-black">
                                {formData.scannedTagId || 'Not scanned yet'}
                            </Text>
                        </View>
                        <View className='bg-[#DADADA] w-full h-[1px] mt-4' />

                        {/* Passport ID */}
                        <View className='mt-4'>
                            <Text className="text-[14px] text-gray-600 mb-1">Passport ID</Text>
                            <Text className="text-[18px] font-medium text-black">
                                {formData.passportId || 'Not selected'}
                            </Text>
                        </View>
                        <View className='bg-[#DADADA] w-full h-[1px] mt-4' />

                        {/* Livestock Keeper */}
                        <View className='mt-4'>
                            <Text className="text-[14px] text-gray-600 mb-1">Livestock Keeper</Text>
                            <Text className="text-[18px] font-medium text-black">
                                {formData.livestockKeeper || 'Not specified'}
                            </Text>
                        </View>
                        <View className='bg-[#DADADA] w-full h-[1px] mt-4' />

                        {/* Livestock Owner */}
                        <View className='mt-4'>
                            <Text className="text-[14px] text-gray-600 mb-1">Livestock Owner</Text>
                            <Text className="text-[18px] font-medium text-black">
                                {formData.livestockOwner || 'Not specified'}
                            </Text>
                        </View>
                        <View className='bg-[#DADADA] w-full h-[1px] mt-4' />

                        {/* Livestock Type */}
                        <View className='mt-4'>
                            <Text className="text-[14px] text-gray-600 mb-1">Livestock Type</Text>
                            <Text className="text-[18px] font-medium text-black">
                                {formData.livestockType || 'Not selected'}
                            </Text>
                        </View>
                        <View className='bg-[#DADADA] w-full h-[1px] mt-4' />

                        {/* Livestock Breed */}
                        <View className='mt-4'>
                            <Text className="text-[14px] text-gray-600 mb-1">Livestock Breed</Text>
                            <Text className="text-[18px] font-medium text-black">
                                {formData.livestockBreed || 'Not specified'}
                            </Text>
                        </View>
                        <View className='bg-[#DADADA] w-full h-[1px] mt-4' />

                        {/* Gender */}
                        <View className='mt-4'>
                            <Text className="text-[14px] text-gray-600 mb-1">Gender</Text>
                            <Text className="text-[18px] font-medium text-black">
                                {formData.gender || 'Not specified'}
                            </Text>
                        </View>
                        <View className='bg-[#DADADA] w-full h-[1px] mt-4' />

                        {/* Health Status */}
                        <View className='mt-4'>
                            <Text className="text-[14px] text-gray-600 mb-1">Health Status</Text>
                            <Text className="text-[18px] font-medium text-black">
                                {formData.healthStatus || 'Not specified'}
                            </Text>
                        </View>
                        <View className='bg-[#DADADA] w-full h-[1px] mt-4' />

                        {/* Date of Birth */}
                        <View className='mt-4'>
                            <Text className="text-[14px] text-gray-600 mb-1">Date of Birth</Text>
                            <Text className="text-[18px] font-medium text-black">
                                {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : 'Not specified'}
                            </Text>
                        </View>
                        <View className='bg-[#DADADA] w-full h-[1px] mt-4' />

                        {/* Birth Period */}
                        <View className='mt-4'>
                            <Text className="text-[14px] text-gray-600 mb-1">Birth Period</Text>
                            <Text className="text-[18px] font-medium text-black">
                                {formData.selectBirthPeriod || 'Not specified'}
                            </Text>
                        </View>
                        <View className='bg-[#DADADA] w-full h-[1px] mt-4' />

                        {/* Description */}
                        <View className='mt-4'>
                            <Text className="text-[14px] text-gray-600 mb-1">Description</Text>
                            <Text className="text-[18px] font-medium text-black">
                                {formData.description || 'Not specified'}
                            </Text>
                        </View>
                        <View className='bg-[#DADADA] w-full h-[1px] mt-4' />

                        {/* Tagging Location */}
                        <View className='mt-4'>
                            <Text className="text-[14px] text-gray-600 mb-1">Tagging Location</Text>
                            <Text className="text-[18px] font-medium text-black">
                                {formData.taggingLocation || 'Not specified'}
                            </Text>
                        </View>
                        <View className='bg-[#DADADA] w-full h-[1px] mt-4' />

                        {/* Weight */}
                        <View className='mt-4'>
                            <Text className="text-[14px] text-gray-600 mb-1">Weight</Text>
                            <Text className="text-[18px] font-medium text-black">
                                {formData.weight || 'Not specified'}
                            </Text>
                        </View>
                        <View className='bg-[#DADADA] w-full h-[1px] mt-4' />

                        {/* Production Type */}
                        <View className='mt-4'>
                            <Text className="text-[14px] text-gray-600 mb-1">Production Type</Text>
                            <Text className="text-[18px] font-medium text-black">
                                {formData.productionType || 'Not specified'}
                            </Text>
                        </View>
                        <View className='bg-[#DADADA] w-full h-[1px] mt-4' />

                        {/* Comments for Other Location */}
                        <View className='mt-4'>
                            <Text className="text-[14px] text-gray-600 mb-1">Comments for Other Location</Text>
                            <Text className="text-[18px] font-medium text-black">
                                {formData.commentsOtherLocation || 'Not specified'}
                            </Text>
                        </View>
                        <View className='bg-[#DADADA] w-full h-[1px] mt-4' />

                        {/* Verification Photo */}
                        <View className="mt-6">
                            <Text className="text-[14px] text-gray-600 mb-3">Verification Photo</Text>
                            <View className="bg-white rounded-lg p-4 flex-row items-start justify-between border border-gray-300">
                                <View className="flex-row items-start">
                                    <View className="w-[91px] h-[91px] rounded-lg mr-3 items-center justify-center">
                                        {formData.verificationPhoto ? (
                                            <Image
                                                source={{ uri: formData.verificationPhoto }}
                                                className="w-full h-full rounded-lg"
                                                resizeMode='cover'
                                            />
                                        ) : (
                                            <View className="bg-gray-200 rounded-lg flex-1 items-center justify-center">
                                                <Text className="text-gray-400">No verification photo</Text>
                                            </View>
                                        )}
                                    </View>
                                    <View>
                                        <Text className="text-[14px] font-medium text-black">
                                            {formData.verificationPhoto ? 'Verification Photo' : 'No photo selected'}
                                        </Text>
                                        <Text className="text-xs text-gray-500">
                                            {formData.verificationPhoto ? 'Image selected' : 'No image selected'}
                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity>
                                    <Ionicons name="close" size={20} color="#6b7280" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Muzzle Photo */}
                        <View className="mt-4">
                            <Text className="text-[14px] text-gray-600 mb-3">Muzzle Photo</Text>
                            <View className="bg-white rounded-lg p-4 flex-row items-start justify-between border border-gray-300">
                                <View className="flex-row items-start">
                                    <View className="w-[91px] h-[91px] rounded-lg mr-3 items-center justify-center">
                                        {formData.muzzlePhoto ? (
                                            <Image
                                                source={{ uri: formData.muzzlePhoto }}
                                                className="w-full h-full rounded-lg"
                                                resizeMode='cover'
                                            />
                                        ) : (
                                            <View className="bg-gray-200 rounded-lg flex-1 items-center justify-center">
                                                <Text className="text-gray-400">No muzzle photo</Text>
                                            </View>
                                        )}
                                    </View>
                                    <View>
                                        <Text className="text-[14px] font-medium text-black">
                                            {formData.muzzlePhoto ? 'Muzzle Photo' : 'No photo selected'}
                                        </Text>
                                        <Text className="text-xs text-gray-500">
                                            {formData.muzzlePhoto ? 'Image selected' : 'No image selected'}
                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity>
                                    <Ionicons name="close" size={20} color="#6b7280" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Submit Button */}
            <View className="p-4 bg-white border-t border-gray-200">
                <TouchableOpacity
                    onPress={handleSubmit}
                    className="bg-blue-600 rounded-lg py-4 flex-row items-center justify-center"
                >
                    <Text className="text-white font-semibold text-[18px] mr-2">Submit</Text>
                    <Ionicons name="cloud-upload-outline" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}