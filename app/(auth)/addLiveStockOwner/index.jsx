import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import InputField from '../../../components/InputField';
import { Picker } from '@react-native-picker/picker';
import CustomButton from '../../../components/CustomButton';
import CancelButton from '../../../components/CancelButton';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddLivestockOwner() {
    const navigation = useNavigation();
    const [ownership_type, setOwnershipType] = useState('');
    const [isLivestockKeeper, setIsLivestockKeeper] = useState(false);
    const [gender, setGender] = useState('');
    const [surname, setSurname] = useState('');
    const [other_names, setOtherNames] = useState('');
    const [dob, setDob] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [nin, setNin] = useState('');
    const [email_address, setEmail] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [states, setStates] = useState([]);
    const [state, setState] = useState('');
    const [lgas, setLgas] = useState([]);
    const [lga, setLga] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Form errors state
    const [errors, setErrors] = useState({});
    
    // Validate a single field
    const validateField = (name, value) => {
        let error = '';
        
        if (!value) {
            error = 'This field is required';
        } else if (name === 'phone_number' && !/^\d{11}$/.test(value)) {
            error = 'Please enter a valid 11-digit phone number';
        } else if (name === 'email_address' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            error = 'Please enter a valid email address';
        } else if (name === 'nin' && !/^\d{11}$/.test(value)) {
            error = 'Please enter a valid 11-digit NIN';
        }
        
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
        
        return !error;
    };
    
    // Handle input change with validation
    const handleInputChange = (setter, name, value) => {
        setter(value);
        if (errors[name]) {
            validateField(name, value);
        }
    };

    useEffect(() => {
        const initializeData = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (!token) {
                    Alert.alert('Error', 'Please login again');
                    router.replace('/');
                    return;
                }

                // Test token validity
                const testResponse = await fetch('https://api.ranchid.app/api/test', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!testResponse.ok) {
                    Alert.alert('Error', 'Session expired. Please login again');
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
                console.log('API Response:', data); // Log the full response
                
                if (!data || !data.data || !Array.isArray(data.data)) {
                    throw new Error('Invalid states data received from server');
                }

                // Log the first state's structure
                if (data.data.length > 0) {
                    console.log('First state structure:', data.data[0]);
                }

                setStates(data.data);

                navigation.setOptions({
                    headerShown: false,
                });
            } catch (error) {
                console.error('Initialization error:', error);
                Alert.alert('Error', 'Please login again');
                router.replace('/');
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
            console.log('Numeric state:', numericState);
            
            const selectedState = states.find(s => {
                // Try different ID formats
                return s.state_id === numericState || 
                       s.state_id === state || 
                       s.id === numericState || 
                       s.id === state || 
                       s.name === state;
            });
            console.log('Selected state object:', selectedState);
            
            if (selectedState) {
                // Use the locals array directly from the state object
                const locals = selectedState.locals;
                console.log('Found locals:', locals);
                
                if (locals && Array.isArray(locals)) {
                    console.log('Setting LGAs:', locals);
                    setLgas(locals);
                } else {
                    console.error('Invalid locals data for state:', selectedState);
                }
            }
        }
    }, [state, states]);

    // Reset LGA when state changes
    useEffect(() => {
        if (state) {
            setLga(''); // Reset LGA when state changes
        }
    }, [state]);

    const handleNext = async () => {
        console.log('Next button clicked, validating form...');
        
        // Validate all fields
        const fields = [
            { name: 'surname', value: surname },
            { name: 'other_names', value: other_names },
            { name: 'gender', value: gender },
            { name: 'dob', value: dob },
            { name: 'phone_number', value: phone_number },
            { name: 'email_address', value: email_address },
            { name: 'nin', value: nin },
            { name: 'state', value: state },
            { name: 'lga', value: lga },
            { name: 'address1', value: address1 },
            { name: 'ownership_type', value: ownership_type }
        ];
        
        const isValid = fields.every(field => validateField(field.name, field.value));
        
        if (!isValid) {
            console.log('Form validation failed');
            return;
        }

        try {
            // Store step 1 data in AsyncStorage with all required fields
            const step1Data = {
                surname,
                other_names,
                gender,
                dob,
                phone_number,
                email_address,
                nin,
                state: state, // Store the state ID directly
                lga: lga, // Store the LGA ID directly
                address1,
                address2,
                ownership_type: String(ownership_type),
                group_name: "",
                livestock_keeper: isLivestockKeeper,
                timestamp: new Date().toISOString(),
            };

            await AsyncStorage.setItem('livestockOwnerStep1', JSON.stringify(step1Data));
            console.log('Step 1 data stored:', step1Data);

            router.push('/(auth)/addLiveStockOwner/LivestockOwner2');
        } catch (error) {
            console.error('Error storing step 1 data:', error);
            Alert.alert('Error', 'Failed to save form data. Please try again.');
        }
    };

    // Helper component to display error messages
    const ErrorMessage = ({ error }) => {
        if (!error) return null;
        return <Text className="text-red-500 text-xs mt-1">{error}</Text>;
    };

    return (
        <SafeAreaView className="h-full bg-[#FAF7F1]">
            <ScrollView className="px-4">
                <TouchableOpacity
                    className="flex-row items-center gap-3 bg-[#fff] p-5"
                    onPress={() => router.back()}
                >
                    <AntDesign name="left" size={10} color="black" />
                    <Text className="text-[#282828] text-[24px] font-normal">Add Livestock Owner</Text>
                </TouchableOpacity>
                <View className="mt-5">
                    <Text className="text-[#282828] text-[24px] font-semibold">Step 01/02</Text>
                    <Text className="text-[#5B626C] text-[18px] font-medium mt-2">
                        Please fill out the following details.
                    </Text>
                </View>
                <View className='mt-8'>
                    <InputField
                        label="Ownership Type"
                        type="dropdown"
                        value={ownership_type}
                        onChange={setOwnershipType}
                        options={[
                            { label: "Select ownership type", value: '' },
                            { label: "CORPORATE BODY", value: "CORPORATE_BODY" },
                            { label: "Option 2", value: "2" },
                        ]}
                    />
                    <Text className='text-[#414141] text-[14px] font-semibold'>Are you a Livestock Keeper?</Text>
                    <InputField
                        type="checkbox"
                        value={isLivestockKeeper}
                        onChange={setIsLivestockKeeper}
                        options={[
                            { label: "Yes", value: true },
                            { label: "No", value: false },
                        ]}
                        className='flex-row items-center gap-6 mt-4'
                    />
                    <View className='mt-4'>
                        <InputField
                            label="Surname"
                            type="text"
                            value={surname}
                            onChange={(value) => handleInputChange(setSurname, 'surname', value)}
                            onBlur={() => validateField('surname', surname)}
                        />
                        <ErrorMessage error={errors.surname} />
                    </View>
                    <View className='mt-4'>
                        <InputField
                            label="Other Names"
                            type="text"
                            value={other_names}
                            onChange={(value) => handleInputChange(setOtherNames, 'other_names', value)}
                            onBlur={() => validateField('other_names', other_names)}
                        />
                        <ErrorMessage error={errors.other_names} />
                    </View>
                    <View className='mt-4'>
                        <Text className='text-[#414141] text-[14px] font-semibold'>Gender</Text>
                        <View className='flex-row items-center gap-6 mt-2'>
                            {[
                                { label: "Male", value: "MALE" },
                                { label: "Female", value: "FEMALE" },
                            ].map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    className={`flex-row items-center ${gender === option.value ? 'bg-blue-100' : ''} p-2 rounded`}
                                    onPress={() => {
                                        setGender(option.value);
                                        validateField('gender', option.value);
                                    }}
                                >
                                    <View className={`w-5 h-5 rounded-full border-2 ${gender === option.value ? 'bg-blue-500 border-blue-500' : 'border-gray-400'} items-center justify-center mr-2`}>
                                        {gender === option.value && <View className='w-2 h-2 rounded-full bg-white' />}
                                    </View>
                                    <Text>{option.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <ErrorMessage error={errors.gender} />
                    </View>

                    <View className='mt-4'>
                        <InputField
                            label="Date of Birth"
                            type="date"
                            value={dob}
                            onChange={(value) => handleInputChange(setDob, 'dob', value)}
                            onBlur={() => validateField('dob', dob)}
                        />
                        <ErrorMessage error={errors.dob} />
                    </View>

                    <View className='mt-4'>
                        <InputField
                            label="Phone Number"
                            type="text"
                            value={phone_number}
                            onChange={(value) => handleInputChange(setPhoneNumber, 'phone_number', value)}
                            onBlur={() => validateField('phone_number', phone_number)}
                            keyboardType="phone-pad"
                        />
                        <ErrorMessage error={errors.phone_number} />
                    </View>

                    <View className='mt-4'>
                        <InputField
                            label="NIN"
                            type="text"
                            value={nin}
                            onChange={(value) => handleInputChange(setNin, 'nin', value)}
                            onBlur={() => validateField('nin', nin)}
                            keyboardType="numeric"
                        />
                        <ErrorMessage error={errors.nin} />
                    </View>

                    <View className='mt-4'>
                        <InputField
                            label="Email"
                            type="email"
                            value={email_address}
                            onChange={(value) => handleInputChange(setEmail, 'email_address', value)}
                            onBlur={() => validateField('email_address', email_address)}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                        <ErrorMessage error={errors.email_address} />
                    </View>

                    <View className='mt-4'>
                        <InputField
                            label="Address 1"
                            type="text"
                            value={address1}
                            onChange={(value) => handleInputChange(setAddress1, 'address1', value)}
                            onBlur={() => validateField('address1', address1)}
                        />
                        <ErrorMessage error={errors.address1} />
                    </View>

                    <View className='mt-4'>
                        <InputField
                            label="Address 2"
                            type="text"
                            value={address2}
                            onChange={setAddress2}
                        />
                    </View>
                    <View className='mt-4'>
                        <Text className="text-[14px] font-semibold text-[#414141]">State</Text>
                        <View className={`border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-white justify-center mt-2`}>
                            <Picker
                                selectedValue={state}
                                onValueChange={(value) => {
                                    setState(value);
                                    validateField('state', value);
                                    setLga(''); // Reset LGA when state changes
                                }}
                                style={{ width: '100%' }}
                            >
                                <Picker.Item key="select-state" label="Select State" value="" />
                                {states.map((s) => (
                                    <Picker.Item
                                        key={`state-${s.state_id}`}
                                        label={s.name}
                                        value={String(s.state_id)}
                                    />
                                ))}
                            </Picker>
                        </View>
                        <ErrorMessage error={errors.state} />
                    </View>

                    <View className='mt-4'>
                        <Text className="text-[14px] font-semibold text-[#414141]">LGA</Text>
                        <View className={`border ${errors.lga ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-white justify-center mt-2`}>
                            <Picker
                                selectedValue={lga}
                                onValueChange={(value) => {
                                    setLga(value);
                                    validateField('lga', value);
                                }}
                                style={{ width: '100%' }}
                                enabled={lgas.length > 0}
                            >
                                <Picker.Item key="select-lga" label={state ? "Select LGA" : "Select State first"} value="" />
                                {lgas.map((l) => (
                                    <Picker.Item
                                        key={`lga-${l.local_id}`}
                                        label={l.local_name}
                                        value={String(l.local_id)}
                                    />
                                ))}
                            </Picker>
                        </View>
                        <ErrorMessage error={errors.lga} />
                    </View>
                </View>
                <View className="flex-row items-center justify-between px-4 py-5 gap-3 border-t-[#CEBAA747]/70 border-t mt-5 pt-5">
                    <CancelButton
                        title="Cancel"
                        containerStyles="flex-1 h-[64px]"
                        onPress={() => router.push('/(dashboard)/dashboard')}
                    />
                    <CustomButton
                        title={isLoading ? "Saving..." : "Next"}
                        containerStyles="flex-1 h-[64px]"
                        handlePress={handleNext}
                        disabled={isLoading}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}