import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import InputField from '../../../components/InputField';
import { Picker } from '@react-native-picker/picker';
import CustomButton from '../../../components/CustomButton';
import CancelButton from '../../../components/CancelButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddLivestockKeeper() {
    const navigation = useNavigation();
    const [gender, setGender] = useState('');
    const [surname, setSurname] = useState('');
    const [other_names, setOtherNames] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [nin, setNIN] = useState('');
    const [email_address, setEmailAddress] = useState('');
    const [address, setAddress] = useState('');
    const [address2, setAddress2] = useState('');
    const [states, setStates] = useState([]);
    const [state, setState] = useState('');
    const [lgas, setLgas] = useState([]);
    const [lga, setLga] = useState('');
    const [isLivestockKeeper, setIsLivestockKeeper] = useState(true);


    useEffect(() => {
        checkToken();
    }, []);

    const checkToken = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            console.log('Retrieved Token:', token); // Debugging

            if (!token) {
                console.log('No token found, redirecting to login.');
                Alert.alert('Error', 'Please login again');
                router.replace('/');
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error retrieving token:', error);
            Alert.alert('Error', 'Please login again');
            router.replace('/');
            return false;
        }
    };

    // Prevent form submission if required fields are empty
    const handleNext = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            // Check token before proceeding
            const hasToken = await checkToken();
            if (!hasToken) {
                return;
            }

            // Store step 1 data in AsyncStorage with all required fields
            const step1Data = {
                surname,
                other_names,
                gender,
                dateOfBirth,
                phone_number,
                nin,
                email_address,
                address,
                address2,
                state,
                lga,
                livestock_keeper: isLivestockKeeper,
                timestamp: new Date().toISOString(),
            };

            await AsyncStorage.setItem('livestockKeeperStep1', JSON.stringify(step1Data));
            console.log('Step 1 data stored:', step1Data);

            router.push('/(auth)/addLiveStockKeeper/LivestockKeeper2');
        } catch (error) {
            console.error('Error storing step 1 data:', error);
            Alert.alert('Error', 'Failed to save form data. Please try again.');
        }
    };

    const validateForm = () => {
        if (!surname || !other_names || !gender || !dateOfBirth ||
            !phone_number || !nin || !address || !state || !lga) {
            alert("Please fill out all required fields.");
            return false;
        }

        // Validate phone number format
        const phoneRegex = /^(?:\+234|0)[789][01]\d{8}$/;
        if (!phoneRegex.test(phone_number)) {
            Alert.alert('Error', 'Enter a valid Nigerian phone number.');
            return false;
        }

        if (!/^\d{11}$/.test(nin)) {
            Alert.alert('Error', 'NIN must be exactly 11 digits.');
            return false;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email_address.trim().toLowerCase())) {
            Alert.alert('Error', 'Please enter a valid email address');
            return false;
        }

        if (!state || !lga) {
            Alert.alert('Error', 'Please select a valid state and LGA.');
            return false;
        }

        return true;
    };


    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    // Initialize data
    useEffect(() => {
        const initializeData = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (!token) {
                    Alert.alert('Error', 'Please login again');
                    router.replace('/');
                    return;
                }

                // Fetch states and LGAs
                const response = await fetch('https://api.ranchid.app/api/state_locals', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch states and LGAs');
                }

                const data = await response.json();
                console.log('API Response:', data);
                
                if (!data || !data.data || !Array.isArray(data.data)) {
                    throw new Error('Invalid states data received from server');
                }

                setStates(data.data);

                navigation.setOptions({
                    headerShown: false,
                });
            } catch (error) {
                console.error('Initialization error:', error);
                Alert.alert('Error', 'Failed to load location data. Please try again.');
            }
        };

        initializeData();
    }, []);

    // Update LGAs when state changes
    useEffect(() => {
        if (state) {
            console.log('Selected state:', state);
            // Convert state to number if it's a string
            const numericState = typeof state === 'string' ? parseInt(state) : state;
            
            const selectedState = states.find(s => {
                // Try different ID formats
                return s.state_id === numericState || 
                       s.state_id === state || 
                       s.id === numericState || 
                       s.id === state || 
                       s.name === state;
            });
            
            if (selectedState) {
                // Use the locals array directly from the state object
                const locals = selectedState.locals || [];
                console.log('Setting LGAs:', locals);
                setLgas(locals);
            } else {
                setLgas([]);
            }
            setLga(''); // Reset LGA when state changes
        } else {
            setLgas([]);
            setLga('');
        }
    }, [state, states]);

    return (
        <SafeAreaView className="h-full bg-[#FAF7F1]">
            <ScrollView className="px-4">
                <TouchableOpacity
                    className="flex-row items-center gap-3 bg-[#fff] p-5"
                    onPress={() => router.back()}
                >
                    <AntDesign name="left" size={10} color="black" />
                    <Text className="text-[#282828] text-[24px] font-normal">Add Livestock Keeper</Text>
                </TouchableOpacity>
                <View className="mt-5">
                    <Text className="text-[#282828] text-[24px] font-semibold">Step 01/02</Text>
                    <Text className="text-[#5B626C] text-[18px] font-medium mt-2">
                        Please fill out the following details.
                    </Text>
                </View>
                <View className='mt-8'>
                    <InputField
                        label="Surname"
                        type="text"
                        className='mt-4'
                        value={surname}
                        onChange={setSurname}
                    />
                    <InputField
                        label="Other Names"
                        type="text"
                        className='mt-4'
                        value={other_names}
                        onChange={setOtherNames}
                    />
                    <InputField
                        type="radio"
                        label="Gender"
                        value={gender}
                        onChange={setGender}
                        options={[
                            { label: "Male", value: "Male" },
                            { label: "Female", value: "Female" },
                        ]}
                        className='flex-row items-center gap-6 mt-2 mb-3'
                    />
                    <InputField
                        label="Date of Birth"
                        type="date"
                        placeholder='Select Date of Birth'
                        className='mt-4'
                        value={dateOfBirth}
                        onChange={setDateOfBirth}
                    />
                    <InputField
                        label="Phone Number"
                        type="text"
                        className='mt-4'
                        value={phone_number}
                        onChange={setPhoneNumber}
                    />
                    <InputField
                        label="NIN"
                        type="text"
                        className='mt-4'
                        onChange={setNIN}
                        value={nin}
                    />
                    <InputField
                        label="Email"
                        type="email"
                        className='mt-4'
                        value={email_address}
                        onChange={setEmailAddress}
                    />
                    <InputField
                        label="Address 1"
                        type="text"
                        className='mt-4'
                        value={address}
                        onChange={setAddress}
                    />
                    <InputField
                        label="Address 2"
                        type="text"
                        className='mt-4'
                        value={address2}
                        onChange={setAddress2}
                    />
                    <View className="mt-4">
                        <Text className="text-[14px] font-semibold text-[#414141] mb-1">State</Text>
                        <View className="border border-gray-300 rounded-lg bg-white">
                            <Picker
                                selectedValue={state}
                                onValueChange={(value) => setState(value)}
                            >
                                <Picker.Item label="Select State" value="" />
                                {states.map((stateItem) => (
                                    <Picker.Item 
                                        key={stateItem.state_id || stateItem.id} 
                                        label={stateItem.name} 
                                        value={stateItem.state_id || stateItem.id} 
                                    />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    
                    <View className="mt-4">
                        <Text className="text-[14px] font-semibold text-[#414141] mb-1">Local Government</Text>
                        <View className="border border-gray-300 rounded-lg bg-white">
                            <Picker
                                selectedValue={lga}
                                onValueChange={(value) => setLga(value)}
                                enabled={!!state && lgas.length > 0}
                            >
                                <Picker.Item 
                                    label={state ? (lgas.length > 0 ? 'Select LGA' : 'Loading LGAs...') : 'Select a state first'} 
                                    value="" 
                                />
                                {lgas.map((lgaItem) => (
                                    <Picker.Item 
                                        key={lgaItem.id || lgaItem.local_id} 
                                        label={lgaItem.name || lgaItem.local_name} 
                                        value={lgaItem.id || lgaItem.local_id} 
                                    />
                                ))}
                            </Picker>
                        </View>
                    </View>
                </View>
                <View className="flex-row items-center justify-between px-4 py-5 gap-3 border-t-[#CEBAA747]/70 border-t mt-5 pt-5">
                    <CancelButton
                        title="Cancel"
                        containerStyles="flex-1 h-[64px]"
                        handlePress={() => router.push('/(dashboard)/dashboard')}
                    />
                    <CustomButton
                        title="Next  >"
                        containerStyles="flex-1 h-[64px]"
                        handlePress={handleNext}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}