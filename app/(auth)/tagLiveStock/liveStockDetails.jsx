import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Alert,
} from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LivestockDetails = () => {
    const [formData, setFormData] = useState({
        scannedTagId: '',
        passportId: '',
        livestockKeeper: '',
        livestockOwner: '',
        livestockType: '',
        livestockBreed: '',
        gender: '',
        healthStatus: '',
        dateOfBirth: new Date(),
        selectBirthPeriod: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Load scannedTagId from AsyncStorage when component mounts
        const loadScannedTagId = async () => {
            try {
                const tagId = await AsyncStorage.getItem('scannedTagId');

                // Handle null/undefined values
                if (!tagId) {
                    throw new Error('No tag ID found in storage');
                }

                setFormData(prev => ({
                    ...prev,
                    scannedTagId: tagId
                }));
            } catch (error) {
                console.error('Error loading scanned tag ID:', error);
                Alert.alert('Error', error.message || 'Failed to load tag ID');
            } finally {
                setIsLoading(false);
            }
        };

        loadScannedTagId();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                onClose();
                router.replace('/');
                return;
            }

            // Get stored user data
            const storedUserData = await AsyncStorage.getItem('userData');
            if (storedUserData) {
                const parsedUserData = JSON.parse(storedUserData);
                setUserData(parsedUserData);
                // Update livestockOwner in formData
                setFormData(prev => ({
                    ...prev,
                    livestockOwner: `${parsedUserData?.surname || ''} ${parsedUserData?.other_names || ''}`.trim()
                }));
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            Alert.alert('Error', 'Failed to load user profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    console.log('User Name', userData?.surname, userData?.other_names)

    const [showDatePicker, setShowDatePicker] = useState(false);

    console.log('scannedTagId', formData.scannedTagId);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setFormData(prev => ({
                ...prev,
                dateOfBirth: selectedDate
            }));
        }
    };

    const handleNext = async () => {
        // Validate all fields
        const requiredFields = {
            passportId: formData.passportId,
            livestockKeeper: formData.livestockKeeper,
            livestockType: formData.livestockType,
            livestockBreed: formData.livestockBreed,
            gender: formData.gender,
            healthStatus: formData.healthStatus,
            dateOfBirth: formData.dateOfBirth,
            selectBirthPeriod: formData.selectBirthPeriod,
            livestockOwner: formData.livestockOwner,
        };

        const missingFields = Object.keys(requiredFields)
            .filter(key => !requiredFields[key] || (key === 'dateOfBirth' && !requiredFields[key].toString()))
            .map(key => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()));

        if (missingFields.length > 0) {
            Alert.alert(
                'Error',
                `Please fill in the following required fields:\n${missingFields.join('\n')}`
            );
            return;
        }

        try {
            // Store livestock data in AsyncStorage
            await AsyncStorage.setItem('livestockData', JSON.stringify(formData));
            router.push('/(auth)/tagLiveStock/captureVerification');
        } catch (error) {
            console.error('Error storing livestock data:', error);
            Alert.alert('Error', 'Failed to save livestock data');
        }
    };

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-[#FAF7F1]">
                <Text>Getting Tag...</Text>
            </View>
        );
    }

    if (!formData.scannedTagId) {
        return (
            <View className="flex-1 justify-center items-center bg-[#FAF7F1]">
                <Text>No tag ID found. Please scan a tag first.</Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#FAF7F1]">
            {/* Header */}
            <TouchableOpacity
                className="flex-row items-center gap-3 bg-[#fff] p-5"
                onPress={() => router.back()}
            >
                <AntDesign name="left" size={10} color="black" />
                <Text className="text-[#282828] text-[24px] font-normal">Tag Livestock</Text>
            </TouchableOpacity>

            <View className="mt-3 px-4">
                <Text className="text-[#282828] text-[24px] font-semibold">Step 02/03</Text>
                <Text className="text-[#5B626C] text-[18px] font-medium mt-2">
                    Fill Livestock Details
                </Text>
            </View>

            <ScrollView className="flex-1 px-4 py-4 mt-3" showsVerticalScrollIndicator={false}>
                {/* Scanned Tag ID */}
                <View className="mb-4">
                    <Text className="text-sm text-gray-600 mb-2">Scanned Tag ID</Text>
                    <View className="bg-white py-4 px-3 border border-gray-300 rounded-lg">
                        <Text className="text-base font-bold">{formData.scannedTagId}</Text>
                    </View>
                </View>

                {/* Passport ID */}
                <View className="mb-4">
                    <Text className="text-sm text-gray-600 mb-2">Passport ID</Text>
                    <View className="bg-white border border-gray-300 rounded-lg">
                        <Picker
                            selectedValue={formData.passportId}
                            onValueChange={(value) => handleInputChange('passportId', value)}
                            style={{ height: 50 }}
                        >
                            <Picker.Item label="Select passport ID" value="" />
                            <Picker.Item label="NIN" value="nin" />
                            <Picker.Item label="Driver License" value="driver_license" />
                            <Picker.Item label="Passport" value="passport" />
                        </Picker>
                    </View>
                    {/* <TextInput
                        className="bg-white border border-gray-300 rounded-lg px-3 py-4 text-base"
                        value={formData.passportId}
                        onChangeText={(value) => handleInputChange('passportId', value)}
                        placeholder="Enter passport ID"
                    /> */}
                </View>

                {/* Livestock Keeper */}
                <View className="mb-4">
                    <Text className="text-sm text-gray-600 mb-2">Livestock Keeper</Text>
                    <View className="bg-white border border-gray-300 rounded-lg">
                        <Picker
                            selectedValue={formData.livestockKeeper}
                            onValueChange={(value) => handleInputChange('livestockKeeper', value)}
                            style={{ height: 50 }}
                        >
                            <Picker.Item label="Select livestock keeper" value="" />
                            <Picker.Item label="John Doe" value="john_doe" />
                            <Picker.Item label="Jane Smith" value="jane_smith" />
                            <Picker.Item label="Mike Johnson" value="mike_johnson" />
                        </Picker>
                    </View>
                </View>

                {/* Livestock Type */}
                <View className="mb-4">
                    <Text className="text-sm text-gray-600 mb-2">Livestock Type</Text>
                    <View className="bg-white border border-gray-300 rounded-lg">
                        <Picker
                            selectedValue={formData.livestockType}
                            onValueChange={(value) => handleInputChange('livestockType', value)}
                            style={{ height: 50 }}
                        >
                            <Picker.Item label="Select livestock type" value="" />
                            <Picker.Item label="Cattle" value="cattle" />
                            <Picker.Item label="Sheep" value="sheep" />
                            <Picker.Item label="Goat" value="goat" />
                            <Picker.Item label="Pig" value="pig" />
                        </Picker>
                    </View>
                </View>

                {/* Livestock Breed */}
                <View className="mb-4">
                    <Text className="text-sm text-gray-600 mb-2">Livestock Breed</Text>
                    <View className="bg-white border border-gray-300 rounded-lg">
                        <Picker
                            selectedValue={formData.livestockBreed}
                            onValueChange={(value) => handleInputChange('livestockBreed', value)}
                            style={{ height: 50 }}
                        >
                            <Picker.Item label="Select breed" value="" />
                            <Picker.Item label="Holstein" value="holstein" />
                            <Picker.Item label="Angus" value="angus" />
                            <Picker.Item label="Hereford" value="hereford" />
                            <Picker.Item label="Jersey" value="jersey" />
                        </Picker>
                    </View>
                </View>

                {/* Gender */}
                <View className="mb-4">
                    <Text className="text-sm text-gray-600 mb-2">Gender</Text>
                    <View className="bg-white border border-gray-300 rounded-lg">
                        <Picker
                            selectedValue={formData.gender}
                            onValueChange={(value) => handleInputChange('gender', value)}
                            style={{ height: 50 }}
                        >
                            <Picker.Item label="Select gender" value="" />
                            <Picker.Item label="Male" value="male" />
                            <Picker.Item label="Female" value="female" />
                        </Picker>
                    </View>
                </View>

                {/* Health Status */}
                <View className="mb-4">
                    <Text className="text-sm text-gray-600 mb-2">Health Status</Text>
                    <View className="bg-white border border-gray-300 rounded-lg">
                        <Picker
                            selectedValue={formData.healthStatus}
                            onValueChange={(value) => handleInputChange('healthStatus', value)}
                            style={{ height: 50 }}
                        >
                            <Picker.Item label="Select health status" value="" />
                            <Picker.Item label="Healthy" value="healthy" />
                            <Picker.Item label="Sick" value="sick" />
                            <Picker.Item label="Under Treatment" value="under_treatment" />
                        </Picker>
                    </View>
                </View>

                {/* Date of Birth */}
                <View className="mb-4">
                    <Text className="text-sm text-gray-600 mb-2">Date of Birth</Text>
                    <TouchableOpacity
                        className="bg-white border border-gray-300 rounded-lg px-3 py-3 flex-row justify-between items-center"
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text className="text-base">
                            {formData.dateOfBirth.toLocaleDateString()}
                        </Text>
                        <Ionicons name="calendar-outline" size={20} color="#666" />
                    </TouchableOpacity>
                </View>

                {/* Select Birth Period */}
                <View className="mb-10">
                    <Text className="text-sm text-gray-600 mb-2">Select Birth Period</Text>
                    <View className="bg-white border border-gray-300 rounded-lg">
                        <Picker
                            selectedValue={formData.selectBirthPeriod}
                            onValueChange={(value) => handleInputChange('selectBirthPeriod', value)}
                            style={{ height: 50 }}
                        >
                            <Picker.Item label="Select birth period" value="" />
                            <Picker.Item label="Morning" value="morning" />
                            <Picker.Item label="Afternoon" value="afternoon" />
                            <Picker.Item label="Evening" value="evening" />
                            <Picker.Item label="Night" value="night" />
                        </Picker>
                    </View>
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

            {/* Date Picker Modal */}
            {showDatePicker && (
                <DateTimePicker
                    value={formData.dateOfBirth}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}
        </SafeAreaView>
    );
};

export default LivestockDetails;