import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router, useNavigation, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputField from '../../../components/InputField';
import CancelButton from '../../../components/CancelButton';
import CustomButton from '../../../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function LivestockOwner2() {
  const navigation = useNavigation();
  const { formData: formDataString } = useLocalSearchParams();
  const step1Data = formDataString ? JSON.parse(formDataString) : null;

  // Step 2 form fields
  const [next_of_kin, setNextOfKin] = useState('');
  const [next_of_kin_number, setNextOfKinNumber] = useState('');
  const [id_doc_type, setIdDocType] = useState('');
  const [prof_id_doc, setProfIdDoc] = useState('');
  const [farm_location, setFarmLocation] = useState('');
  const [showOtherLocation, setShowOtherLocation] = useState(false);
  const [otherLocation, setOtherLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState(null);
  
  // Form errors state
  const [errors, setErrors] = useState({
    next_of_kin: '',
    next_of_kin_number: '',
    id_doc_type: '',
    prof_id_doc: '',
    farm_location: ''
  });
  
  // Location options
  const locationOptions = [
    'Lagos',
    'Abuja',
    'Kano',
    'Port Harcourt',
    'Ibadan',
    'Other'
  ];
  
  // Validate a single field
  const validateField = (name, value) => {
    let error = '';
    
    if (!value) {
      error = 'This field is required';
    } else if (name === 'next_of_kin_number' && !/^\d{11}$/.test(value)) {
      error = 'Please enter a valid 11-digit phone number';
    } else if (name === 'prof_id_doc' && !value.trim()) {
      error = 'Please enter a valid document number';
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
  
  // Handle location change
  const handleLocationChange = (value) => {
    setFarmLocation(value);
    setShowOtherLocation(value === 'Other');
    if (value !== 'Other') {
      setOtherLocation('');
      validateField('farm_location', value);
    } else {
      // Clear the farm_location when 'Other' is selected
      setFarmLocation('');
    }
  };
  
  // Handle other location input
  const handleOtherLocationChange = (value) => {
    setOtherLocation(value);
    if (value.trim()) {
      setFarmLocation(value);
      validateField('farm_location', value);
    } else {
      setFarmLocation('');
    }
  };

  useEffect(() => {
    // Set navigation options
    navigation.setOptions({ headerShown: false });
  }, []);

  const validateForm = () => {
    // Validate all fields
    const fields = [
      { name: 'next_of_kin', value: next_of_kin },
      { name: 'next_of_kin_number', value: next_of_kin_number },
      { name: 'id_doc_type', value: id_doc_type },
      { name: 'prof_id_doc', value: prof_id_doc },
      { name: 'farm_location', value: farm_location || (showOtherLocation ? otherLocation : '') }
    ];
    
    const validationResults = fields.map(field => validateField(field.name, field.value));
    return validationResults.every(valid => valid);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    // Validate all fields before submission
    if (!validateForm()) {
      // Scroll to the first error
      return;
    }

    try {
      setIsSubmitting(true);

      // Log the current state of AsyncStorage
      const allKeys = await AsyncStorage.getAllKeys();
      console.log('AsyncStorage keys:', allKeys);

      // Get all required data from AsyncStorage
      const [token, step1DataString, userData] = await Promise.all([
        AsyncStorage.getItem('userToken'),
        AsyncStorage.getItem('livestockOwnerStep1'),
        AsyncStorage.getItem('userData')
      ]);

      console.log('Token exists:', !!token);
      console.log('Step1 data exists:', !!step1DataString);
      console.log('User data exists:', !!userData);

      // Check if we have all required data
      if (!token || !step1DataString || !userData) {
        const errorMessage = `Missing required data: ${!token ? 'token, ' : ''}${!step1DataString ? 'step1Data, ' : ''}${!userData ? 'userData' : ''}`.replace(/,\s*$/, '');
        console.error('Session data missing:', errorMessage);
        throw new Error('Session data is missing. Please start over.');
      }

      // Verify token format
      if (typeof token !== 'string' || token.trim() === '') {
        console.error('Invalid token format: token is empty or not a string');
        throw new Error('Invalid authentication token. Please login again.');
      }
      
      // Format the token if it doesn't have 'Bearer ' prefix
      const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      // Parse user data to verify it's valid JSON
      let parsedUserData;
      try {
        parsedUserData = JSON.parse(userData);
        if (!parsedUserData || typeof parsedUserData !== 'object') {
          throw new Error('Invalid user data');
        }
      } catch (parseError) {
        console.error('Error parsing user data:', parseError);
        throw new Error('Invalid user data. Please login again.');
      }

      if (!validateForm()) {
        setIsSubmitting(false);
        return;
      }

      let step1Data;
      try {
        step1Data = JSON.parse(step1DataString);
      } catch (parseError) {
        console.error('Error parsing stored data:', parseError);
        throw new Error('Invalid data format. Please try again.');
      }

      // Prepare form data
      const formData = new FormData();

      // Prepare step 1 data with proper formatting
      const formattedStep1Data = {
        ...step1Data,
        // Ensure livestock_keeper is properly formatted as a boolean
        livestock_keeper: step1Data.livestock_keeper === true || 
                         step1Data.livestock_keeper === 'true' ||
                         step1Data.livestock_keeper === '1',
        // Combine address fields
        address: step1Data.address1 || ''
      };

      // Add step 1 data
      Object.entries(formattedStep1Data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          // For boolean fields, send as string '1' or '0' for Laravel validation
          if (key === 'livestock_keeper') {
            formData.append(key, value ? '1' : '0');
          } else {
            formData.append(key, value);
          }
        }
      });

      // Add step 2 data
      formData.append('next_of_kin', next_of_kin);
      formData.append('next_of_kin_number', next_of_kin_number);
      formData.append('id_doc_type', id_doc_type);
      formData.append('prof_id_doc', prof_id_doc);
      formData.append('farm_location', farm_location);
      formData.append('address', step1Data.address1 || ''); // Ensure address is included

      // Add image if available
      if (image) {
        formData.append('image', {
          uri: image.uri,
          type: image.type || 'image/jpeg',
          name: image.fileName || 'profile.jpg'
        });
      }

      // Add user info
      const capturedBy = parsedUserData.username || parsedUserData.email || 'enumerator';
      formData.append('captured_by', capturedBy);

      // Log the form data being sent
      const logData = {};
      for (let [key, value] of formData._parts) {
        logData[key] = value;
      }
      console.log('Form data to be submitted:', logData);

      // Make the API request
      const apiUrl = 'https://api.ranchid.app/api/enumerator/add_livestock_owner';
      console.log('Making request to:', apiUrl);
      
      // Log the form data being sent
      console.log('FormData entries:');
      if (formData._parts) {
        for (let [key, value] of formData._parts) {
          console.log(key, ':', value);
        }
      }

      console.log('Initiating fetch request...');
      let response;
      let responseData;
      
      try {
        // Log the fetch options (without the token for security)
        const fetchOptions = {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': formattedToken,
            // Note: Don't set Content-Type header when using FormData with files
            // The browser will set it with the correct boundary
          },
          body: formData,
        };
        
        // Log fetch options with redacted token
        const loggableOptions = {
          ...fetchOptions,
          headers: {
            ...fetchOptions.headers,
            Authorization: 'Bearer ***' // Redact token in logs
          }
        };
        console.log('Fetch options:', loggableOptions);

        // Make the API request with a timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        fetchOptions.signal = controller.signal;
        
        console.log('Sending request...');
        const startTime = Date.now();
        
        response = await fetch(apiUrl, fetchOptions);
        
        clearTimeout(timeoutId);
        const endTime = Date.now();
        console.log(`Request completed in ${endTime - startTime}ms, status:`, response.status);
        
        // Log response headers
        const responseHeaders = {};
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });
        console.log('Response headers:', responseHeaders);
        
        // Get response as text first
        const responseText = await response.text();
        console.log('Raw response text:', responseText);
        
        // Try to parse as JSON if possible
        try {
          responseData = responseText ? JSON.parse(responseText) : {};
          console.log('Parsed response data:', responseData);
        } catch (jsonError) {
          console.warn('Response is not valid JSON, treating as plain text');
          responseData = { message: responseText };
        }
      } catch (error) {
        console.error('Error making API request:', error);
        throw error;
      }

      if (!response.ok) {
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
      }

      // Clear the step 1 data from storage
      await AsyncStorage.removeItem('livestockOwnerStep1');

      Alert.alert('Success', 'Livestock owner registered successfully');
      router.replace('/(auth)/addLiveStockOwner/success');
    } catch (error) {
      // Enhanced error logging
      const errorDetails = {
        name: error.name,
        message: error.message,
        code: error.code,
        type: typeof error,
        isNetworkError: error.message?.includes('Network request failed') || 
                       error.message?.includes('Failed to fetch') ||
                       error.name === 'TypeError',
        isAbort: error.name === 'AbortError',
        isTimeout: error.message?.includes('timeout') || error.code === 'ECONNABORTED',
        isAuthError: error.message?.includes('401') || 
                    error.message?.toLowerCase().includes('unauthorized') ||
                    error.status === 401,
        responseStatus: response?.status,
        responseStatusText: response?.statusText,
        responseHeaders: response?.headers ? Object.fromEntries(response.headers.entries()) : null,
        responseData: responseData || null,
      };
      
      console.error('Error in form submission:', JSON.stringify(errorDetails, null, 2));
      
      // More specific error messages based on error type
      let errorMessage = 'An unexpected error occurred';
      let shouldLogout = false;
      
      if (errorDetails.isNetworkError) {
        errorMessage = 'Could not connect to the server. Please check your internet connection and try again.';
      } else if (errorDetails.isAbort || errorDetails.isTimeout) {
        errorMessage = 'The request took too long. Your internet connection might be slow or unstable.';
      } else if (errorDetails.isAuthError || 
                errorDetails.responseStatus === 401 || 
                error.message?.includes('Unauthenticated')) {
        errorMessage = 'Your session has expired. Please login again.';
        shouldLogout = true;
      }
      
      // Handle logout if needed
      if (shouldLogout) {
        try {
          await AsyncStorage.multiRemove(['userToken', 'livestockOwnerStep1', 'userData', 'user']);
          router.replace('/');
          return; // Prevent further execution
        } catch (storageError) {
          console.error('Error clearing storage:', storageError);
        }
      } else if (errorDetails.responseStatus) {
        // Handle specific HTTP status codes
        switch (errorDetails.responseStatus) {
          case 400:
            errorMessage = 'Invalid request. Please check your input and try again.';
            break;
          case 403:
            errorMessage = 'You do not have permission to perform this action.';
            break;
          case 404:
            errorMessage = 'The requested resource was not found.';
            break;
          case 500:
            errorMessage = 'A server error occurred. Please try again later.';
            break;
          case 502:
          case 503:
          case 504:
            errorMessage = 'The server is currently unavailable. Please try again later.';
            break;
          default:
            errorMessage = `An error occurred (${errorDetails.responseStatus}). Please try again.`;
        }
      }
      
      // If we have a more specific message from the server, use it
      if (errorDetails.responseData?.message) {
        errorMessage = errorDetails.responseData.message;
      }

      console.log('Showing error to user:', errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCapturePortrait = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'Camera permission is needed to take photos');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handleUploadFromGallery = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'Photo library permission is needed to select images');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
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
          <Text className="text-[#282828] text-[24px] font-normal">Add Livestock Owner</Text>
        </TouchableOpacity>
        <View className="mt-5">
          <Text className="text-[#282828] text-[24px] font-semibold">Step 02/02</Text>
          <Text className="text-[#5B626C] text-[18px] font-medium mt-2">
            Please fill out the following details.
          </Text>
        </View>
        <View className='mt-8'>
          <InputField
            label="Next of Kin"
            type="text"
            value={next_of_kin}
            onChange={(value) => handleInputChange(setNextOfKin, 'next_of_kin', value)}
            onBlur={() => validateField('next_of_kin', next_of_kin)}
            error={errors.next_of_kin}
          />
          {errors.next_of_kin ? <Text className="text-red-500 text-xs mt-1">{errors.next_of_kin}</Text> : null}
        </View>
        
        <View className='mt-4'>
          <InputField
            label="Next of Kin Phone Number"
            type="text"
            value={next_of_kin_number}
            onChange={(value) => handleInputChange(setNextOfKinNumber, 'next_of_kin_number', value)}
            onBlur={() => validateField('next_of_kin_number', next_of_kin_number)}
            keyboardType="phone-pad"
            error={errors.next_of_kin_number}
          />
          {errors.next_of_kin_number ? <Text className="text-red-500 text-xs mt-1">{errors.next_of_kin_number}</Text> : null}
        </View>
        
        <View className='mt-4'>
          <Text className='text-[#414141] text-[14px] font-semibold mb-1'>ID Document Type</Text>
          <View className={`border ${errors.id_doc_type ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-white`}>
            <Picker
              selectedValue={id_doc_type}
              onValueChange={(value) => {
                setIdDocType(value);
                validateField('id_doc_type', value);
              }}
              style={{ width: '100%' }}
            >
              <Picker.Item label="Select ID Document Type" value="" />
              <Picker.Item label="National ID" value="NATIONAL_ID" />
              <Picker.Item label="Voter's Card" value="VOTERS_CARD" />
              <Picker.Item label="Driver's License" value="DRIVERS_LICENSE" />
              <Picker.Item label="International Passport" value="INTERNATIONAL_PASSPORT" />
            </Picker>
          </View>
          {errors.id_doc_type ? <Text className="text-red-500 text-xs mt-1">{errors.id_doc_type}</Text> : null}
        </View>
        
        <View className='mt-4'>
          <InputField
            label="ID Document Number"
            type="text"
            value={prof_id_doc}
            onChange={(value) => handleInputChange(setProfIdDoc, 'prof_id_doc', value)}
            onBlur={() => validateField('prof_id_doc', prof_id_doc)}
            error={errors.prof_id_doc}
          />
          {errors.prof_id_doc ? <Text className="text-red-500 text-xs mt-1">{errors.prof_id_doc}</Text> : null}
        </View>
        
        <View className='mt-4 mb-8'>
          <Text className='text-[#414141] text-[14px] font-semibold mb-1'>Farm Location</Text>
          <View className={`border ${errors.farm_location && !showOtherLocation ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-white`}>
            <Picker
              selectedValue={showOtherLocation ? 'Other' : farm_location}
              onValueChange={handleLocationChange}
              style={{ width: '100%' }}
            >
              <Picker.Item label="Select Farm Location" value="" />
              {locationOptions.map((location, index) => (
                <Picker.Item key={index} label={location} value={location} />
              ))}
            </Picker>
          </View>
          
          {showOtherLocation && (
            <View className='mt-8'>
              <InputField
                label="Other Location"
                type="text"
                value={otherLocation}
                onChange={(value) => handleOtherLocationChange(value)}
                onBlur={() => validateField('farm_location', otherLocation)}
                error={errors.farm_location}
                placeholder="Please specify the location"
              />
            </View>
          )}
          
          {errors.farm_location && !showOtherLocation ? (
            <Text className="text-red-500 text-xs mt-1">{errors.farm_location}</Text>
          ) : null}
        </View>

        <View style={styles.container}>
          {!image ? (
            <TouchableOpacity style={styles.captureButton} onPress={handleCapturePortrait}>
              <Ionicons name="camera-outline" size={32} color="#4A4A4A" />
              <Text style={styles.captureText}>Capture Portrait</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.previewContainer}>
              <Image source={{ uri: image.uri }} style={styles.image} />
              <Text style={styles.imageInfo}>Image.jpeg - {(image.fileSize / 1024).toFixed(2)} KB</Text>
              <TouchableOpacity style={styles.recaptureButton} onPress={handleCapturePortrait}>
                <Text style={styles.recaptureText}>Re-capture Portrait</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View className="flex-row items-center justify-between px-4 py-5 gap-3 border-t-[#CEBAA747]/70 border-t mt-5 pt-5">
          <CancelButton
            title="Cancel"
            containerStyles="flex-1 h-[64px]"
            onPress={() => router.push('/(dashboard)/dashboard')}
          />
          <CustomButton
            title={isSubmitting ? "Saving..." : "Save"}
            containerStyles="flex-1 h-[64px]"
            handlePress={handleSubmit}
            disabled={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#F8F9FA',
  },
  captureButton: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#E7E7E7',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  captureText: {
    marginTop: 5,
    fontSize: 14,
    color: '#4A4A4A',
  },
  previewContainer: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  imageInfo: {
    marginVertical: 5,
    fontSize: 14,
    color: '#4A4A4A',
  },
  recaptureButton: {
    backgroundColor: '#E7E7E7',
    padding: 5,
    borderRadius: 10,
  },
  recaptureText: {
    color: '#4A4A4A',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  pickerItem: {
    fontSize: 16,
  },
});