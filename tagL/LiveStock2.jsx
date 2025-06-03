import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { router, useNavigation, useLocalSearchParams } from 'expo-router';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';
import CancelButton from '../../components/CancelButton';

export default function Livestock2() {
    const navigation = useNavigation();
    const params = useLocalSearchParams();
    const [error, setError] = useState('');

    // Form fields
    const [tagId, setTagId] = useState(params.tagId || '');
    const [passportId, setPassportId] = useState('');
    const [locationKeeper, setLocationKeeper] = useState('');
    const [livestockType, setLivestockType] = useState('');
    const [livestockBreed, setLivestockBreed] = useState('');
    const [gender, setGender] = useState('');
    const [healthStatus, setHealthStatus] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [birthPeriod, setBirthPeriod] = useState('');

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    const validateForm = () => {
        if (!tagId || !passportId || !locationKeeper || !livestockType || !livestockBreed || !gender || !healthStatus || !dateOfBirth || !birthPeriod) {
            setError('Please fill in all required fields');
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (!validateForm()) return;

        const formData = {
            tagId,
            passportId,
            locationKeeper,
            livestockType,
            livestockBreed,
            gender,
            healthStatus,
            dateOfBirth,
            birthPeriod,
            imageUri: params.imageUri
        };

        router.push({
            pathname: '/(auth)/tagLiveStock/tagLiveStock3',
            params: { formData: JSON.stringify(formData) }
        });
    };

    return (
        <SafeAreaView className="h-full bg-[#FAF7F1]">
            <ScrollView className="px-4">
                <TouchableOpacity
                    className="flex-row items-center gap-3 bg-[#fff] p-5"
                    onPress={() => router.back()}
                >
                    <AntDesign name="left" size={10} color="black" />
                    <Text className="text-[#282828] text-[24px] font-normal">Tag Livestock</Text>
                </TouchableOpacity>

                <View className="mt-5">
                    <Text className="text-[#282828] text-[24px] font-semibold">Step 02/03</Text>
                    <Text className="text-[#5B626C] text-[18px] font-medium mt-2">
                        Fill Livestock Details
                    </Text>
                </View>

                {error ? (
                    <Text className="text-red-500 mt-4 text-center">{error}</Text>
                ) : null}

                <View className="mt-8">
                    <InputField
                        label="Scanned Tag ID"
                        type="text"
                        value={tagId}
                        onChange={setTagId}
                        editable={false}
                    />

                    <InputField
                        label="Passport ID"
                        type="dropdown"
                        value={passportId}
                        onChange={setPassportId}
                        options={[
                            { label: "Select Passport ID", value: "" },
                            { label: "Passport ID 1", value: "passport1" },
                            { label: "Passport ID 2", value: "passport2" },
                        ]}
                    />

                    <InputField
                        label="Location Keeper"
                        type="dropdown"
                        value={locationKeeper}
                        onChange={(value) => {
                            setLocationKeeper(value);
                            setError('');
                        }}
                        options={[
                            { label: "Select Location Keeper", value: "" },
                            { label: "Keeper 1", value: "keeper1" },
                            { label: "Keeper 2", value: "keeper2" },
                        ]}
                    />

                    <InputField
                        label="Livestock Type"
                        type="dropdown"
                        value={livestockType}
                        onChange={(value) => {
                            setLivestockType(value);
                            setError('');
                        }}
                        options={[
                            { label: "Select Livestock Type", value: "" },
                            { label: "Cattle", value: "cattle" },
                            { label: "Sheep", value: "sheep" },
                            { label: "Goat", value: "goat" },
                        ]}
                    />

                    <InputField
                        label="Livestock Breed"
                        type="dropdown"
                        value={livestockBreed}
                        onChange={(value) => {
                            setLivestockBreed(value);
                            setError('');
                        }}
                        options={[
                            { label: "Select Breed", value: "" },
                            { label: "Breed 1", value: "breed1" },
                            { label: "Breed 2", value: "breed2" },
                        ]}
                    />

                    <InputField
                        type="radio"
                        label="Gender"
                        value={gender}
                        onChange={(value) => {
                            setGender(value);
                            setError('');
                        }}
                        options={[
                            { label: "Male", value: "male" },
                            { label: "Female", value: "female" },
                        ]}
                        className="flex-row items-center gap-6 mt-2 mb-3"
                    />

                    <InputField
                        label="Health Status"
                        type="dropdown"
                        value={healthStatus}
                        onChange={(value) => {
                            setHealthStatus(value);
                            setError('');
                        }}
                        options={[
                            { label: "Select Health Status", value: "" },
                            { label: "Healthy", value: "healthy" },
                            { label: "Sick", value: "sick" },
                            { label: "Under Treatment", value: "under_treatment" },
                        ]}
                    />

                    <InputField
                        label="Date of Birth"
                        type="date"
                        value={dateOfBirth}
                        onChange={(value) => {
                            setDateOfBirth(value);
                            setError('');
                        }}
                        placeholder="Select Date of Birth"
                    />

                    <InputField
                        label="Birth Period"
                        type="date"
                        value={birthPeriod}
                        onChange={(value) => {
                            setBirthPeriod(value);
                            setError('');
                        }}
                        placeholder="Select Birth Period"
                    />
                </View>

                <View className="flex-row items-center justify-between px-4 py-5 gap-3 border-t-[#CEBAA747]/70 border-t mt-5 pt-5">
                    <CancelButton
                        title="Cancel"
                        containerStyles="flex-1 h-[64px]"
                        handlePress={() => router.push('/(dashboard)/dashboard')}
                    />
                    <CustomButton
                        title="Save >"
                        containerStyles="flex-1 h-[64px]"
                        handlePress={handleNext}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}