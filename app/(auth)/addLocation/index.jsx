import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import InputField from '../../../components/InputField';
import { Picker } from '@react-native-picker/picker';
import CustomButton from '../../../components/CustomButton';
import CancelButton from '../../../components/CancelButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddLocation() {
  const navigation = useNavigation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form fields
  const [owner_name, setOwnerName] = useState('');
  const [location_name, setLocationName] = useState('');
  const [location_address, setLocationAddress] = useState('');
  const [location_type, setLocationType] = useState('');
  const [cac_certificate, setCacCertificate] = useState('');
  const [state, setState] = useState('');
  const [lga, setLga] = useState('');
  const [states, setStates] = useState([]);
  const [lgas, setLgas] = useState([]);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingLgas, setIsLoadingLgas] = useState(false);
  const [additional_notes, setAdditionalNotes] = useState('');
  const longitude = 56.78444434;
  const latitude = 40.1345345;

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoadingStates(true);
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
      } catch (error) {
        console.error('Initialization error:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        Alert.alert('Error', 'Failed to load states. Please check your connection and try again.');
      } finally {
        setIsLoadingStates(false);
      }
    };

    initializeData();
  }, []);
  // Fetch LGAs when state changes
  useEffect(() => {
    const fetchLgas = async () => {
      if (!state) {
        setLgas([]);
        setLga('');
        return;
      }

      setIsLoadingLgas(true);
      try {
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
      } catch (error) {
        console.error('Error fetching LGAs:', error);
        Alert.alert('Error', 'Failed to load LGAs. Please try again.');
        setLgas([]);
      } finally {
        setIsLoadingLgas(false);
      }
    };

    fetchLgas();
  }, [state, states]);

  // Token check and form submission
  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'Please login again');
        router.replace('/');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error checking token:', error);
      Alert.alert('Error', 'Failed to verify authentication');
      return false;
    }
  };

  // Form validation
  const validateForm = () => {
    if (!owner_name || !location_name || !location_address || !location_type || !state || !lga) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }
    return true;
  };

  // Check token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        console.log('Retrieved Token:', token);

        if (!token) {
          console.log('No token found, redirecting to login.');
          Alert.alert('Error', 'Please login again');
          router.replace('/');
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
        Alert.alert('Error', 'Please login again');
        router.replace('/');
      }
    };

    verifyToken();
  }, []);

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userData');

      if (!token) {
        Alert.alert('Error', 'Authentication failed. Please login again');
        router.replace('/');
        return;
      }

      if (!userData) {
        Alert.alert('Error', 'User data not found. Please login again');
        router.replace('/');
        return;
      }

      const user = JSON.parse(userData);

      // Prepare the complete form data for API submission
      const formData = {
        owner_name,
        location_name,
        location_address,
        location_type,
        state,
        lga,
        cac_certificate: cac_certificate || '',
        gps_coordinates: `${latitude},${longitude}`,
        additional_notes: additional_notes || '',
      };
      
      console.log('Submitting form data:', formData);

      console.log('Submitting location data:', formData);

      const response = await fetch('https://api.ranchid.app/api/enumerator/add_registration_location', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData)
      });

      const responseText = await response.text();
      console.log("Raw Response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse JSON response:", e);
        Alert.alert("Error", "Invalid response from server");
        setIsSubmitting(false);
        return;
      }

      if (response.ok) {
        // Store the location data for reference
        await AsyncStorage.setItem('locationData', JSON.stringify(formData));
        console.log('Location data stored:', formData);

        Alert.alert(
          'Success', 
          'Location registered successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Reset form
                setOwnerName('');
                setLocationName('');
                setLocationAddress('');
                setState('');
                setLga('');
                setLocationType('');
                
                // Navigate back to dashboard
                router.replace('/(auth)/addLocation/success');
              }
            }
          ]
        );
      } else {
        if (response.status === 401) {
          Alert.alert('Error', 'Authentication failed. Please login again');
          router.replace('/');
          return;
        }
        
        // Handle validation errors
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join('\n');
          Alert.alert('Validation Error', errorMessages);
        } else {
          throw new Error(data.message || 'Failed to register location');
        }
      }
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', error.message || 'Failed to register location. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <SafeAreaView className="h-full bg-[#FAF7F1]">
      <ScrollView className="px-4">
        <TouchableOpacity
          className="flex-row items-center gap-3 bg-[#fff] p-5"
          onPress={() => router.back()}
        >
          <AntDesign name="left" size={10} color="black" />
          <Text className="text-[#282828] text-[24px] font-normal">Add Livestock Location</Text>
        </TouchableOpacity>
        <View className="mt-5">
          <Text className="text-[#5B626C] text-[18px] font-medium mt-2">
            Please fill out the following details.
          </Text>
        </View>
        {error ? (
          <Text className="text-red-500 mt-4 text-center">{error}</Text>
        ) : null}
        <View className='mt-8'>
          <InputField
            label="Owner's Name"
            type="text"
            className='mt-4'
            value={owner_name}
            onChange={(value) => {
              setOwnerName(value);
              setError("");
            }}
          />
          <InputField
            label="Location Name"
            type="text"
            className='mt-4'
            value={location_name}
            onChange={(value) => {
              setLocationName(value);
              setError("");
            }}
          />
          <InputField
            label="Location Address"
            type="text"
            className='mt-4'
            value={location_address}
            onChange={(value) => {
              setLocationAddress(value);
              setError("");
            }}
          />
          <InputField
            label="Location Type"
            type="dropdown"
            className='mt-4'
            value={location_type}
            onChange={(value) => {
              setLocationType(value);
              setError("");
            }}
            options={[
              { label: "Select a Location Type", value: '' },
              { label: "Farm", value: "farm" },
              { label: "Ranch", value: "ranch" },
              { label: "Grazing Reserve", value: "grazing_reserve" },
              { label: "Market", value: "market" },
              { label: "Abattoir", value: "abattoir" }
            ]}
          />
          <Text className="text-[14px] font-semibold text-[#414141] mt-4">State</Text>
          <View className="border border-gray-300 rounded-lg bg-white justify-center mt-2">
            {isLoadingStates ? (
              <View className="py-4">
                <ActivityIndicator size="small" color="#0000ff" />
              </View>
            ) : (
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
            )}
          </View>
          <Text className="text-[14px] font-semibold text-[#414141] mt-6">LGA</Text>
          <View className="border border-gray-300 rounded-lg bg-white justify-center mt-2 mb-5">
            {isLoadingLgas ? (
              <View className="py-4">
                <ActivityIndicator size="small" color="#0000ff" />
              </View>
            ) : (
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
            )}
          </View>
          <InputField
            label="CAC Certificate ID"
            type="text"
            className='mt-4'
            value={cac_certificate}
            onChange={(value) => {
              setCacCertificate(value);
              setError("");
            }}
          />
        </View>
        <View className="flex-row items-center justify-between px-4 py-5 gap-3 border-t-[#CEBAA747]/70 border-t mt-5 pt-5">
          <CancelButton
            title="Cancel"
            containerStyles="flex-1 h-[64px]"
            handlePress={() => router.push('/(dashboard)/dashboard')}
          />
          <CustomButton
            title={isSubmitting ? "Saving..." : "Save"}
            containerStyles="flex-1 h-[64px]"
            handlePress={handleSubmit}
            // handlePress={() => router.push('/(auth)/addLocation/success')}
            disabled={isSubmitting}
          />
        </View>
        {isSubmitting && (
          <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}