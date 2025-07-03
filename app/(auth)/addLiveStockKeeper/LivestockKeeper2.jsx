import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router, useNavigation, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputField from '../../../components/InputField';
import CancelButton from '../../../components/CancelButton';
import CustomButton from '../../../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function LivestockKeeper2() {
  const navigation = useNavigation();
  const { formData: formDataString } = useLocalSearchParams();
  const [step1Data, setStep1Data] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load step1 data from AsyncStorage when component mounts
  useEffect(() => {
    const loadStep1Data = async () => {
      try {
        const data = await AsyncStorage.getItem('livestockKeeperStep1');
        if (data) {
          const parsedData = JSON.parse(data);
          console.log('Loaded step1 data:', parsedData);
          setStep1Data(parsedData);
        } else {
          console.warn('No step1 data found in AsyncStorage');
          Alert.alert('Error', 'Please complete step 1 first');
          router.back();
        }
      } catch (error) {
        console.error('Error loading step1 data:', error);
        Alert.alert('Error', 'Failed to load form data');
      } finally {
        setIsLoading(false);
      }
    };

    loadStep1Data();
  }, []);

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
    console.log('Form submission started');
    if (isSubmitting) {
      console.log('Submission already in progress');
      return;
    }

    // Validate all fields before submission
    const isValid = validateForm();
    console.log('Form validation result:', isValid);
    if (!isValid) {
      console.log('Form validation failed');
      setIsSubmitting(false);
      return;
    }

    console.log('Form validation passed, proceeding with submission');
    setIsSubmitting(true);

    let response;
    let responseData;

    try {
      // Get token and user data
      const [token, userData] = await Promise.all([
        AsyncStorage.getItem('userToken'),
        AsyncStorage.getItem('userData')
      ]);

      console.log('Token exists:', !!token);
      console.log('Step1 data:', step1Data);
      console.log('User data exists:', !!userData);

      if (!token || !userData) {
        throw new Error('Missing authentication data. Please login again.');
      }

      const parsedUserData = JSON.parse(userData);
      const captured_by = parsedUserData?.name || 'Unknown';

      // Log the form data for debugging
      console.log('Form data parts:');
      console.log('next_of_kin:', next_of_kin);
      console.log('next_of_kin_number:', next_of_kin_number);
      console.log('id_doc_type:', id_doc_type);
      console.log('prof_id_doc:', prof_id_doc);
      console.log('farm_location:', farm_location || otherLocation);
      console.log('captured_by:', captured_by);

      // Prepare form data
      const formData = new FormData();

      // Add step 1 data first
      console.log('Adding step 1 data to formData...');

      // Add all step 1 fields with correct API field names
      const step1Fields = {
        surname: step1Data.surname,
        other_names: step1Data.other_names,
        gender: step1Data.gender,
        date_of_birth: step1Data.dateOfBirth || step1Data.dob,
        phone_number: step1Data.phone_number,
        email: step1Data.email_address,
        nin: step1Data.nin,
        state: step1Data.state, // Changed back to 'state' from 'state_id'
        lga: step1Data.lga,     // Changed back to 'lga' from 'lga_id'
        address: step1Data.address,
        address2: step1Data.address2 || '',
        marital_status: step1Data.marital_status || 'SINGLE', // Default to 'SINGLE' if not provided
        is_livestock_keeper: step1Data.livestock_keeper || true
      };

      // Add each field to formData
      Object.entries(step1Fields).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
          console.log(`Added ${key}:`, value);
        } else {
          console.warn(`Skipping ${key}: value is ${value}`);
        }
      });

      // Add step 2 data
      formData.append('next_of_kin', next_of_kin);
      formData.append('next_of_kin_number', next_of_kin_number);
      formData.append('id_doc_type', id_doc_type);
      formData.append('prof_id_doc', prof_id_doc);
      formData.append('farm_location', farm_location || otherLocation);
      formData.append('captured_by', captured_by);

      // Verify all required fields are present with correct field names
      const requiredFields = [
        'surname', 'other_names', 'gender', 'date_of_birth', 'phone_number',
        'email', 'nin', 'state', 'lga', 'address', // Changed back to 'state' and 'lga'
        'next_of_kin', 'next_of_kin_number', 'id_doc_type', 'prof_id_doc', 'farm_location',
        'marital_status' // Added marital_status as required
      ];

      const missingFields = [];

      // Log all form data entries
      console.log('--- Form Data Entries ---');
      for (const [key, value] of formData._parts) {
        console.log(`${key}:`, value);
      }

      // Check for missing required fields
      requiredFields.forEach(field => {
        const value = formData.get(field);
        console.log(`Checking ${field}:`, value);
        if (value === null || value === undefined || value === '') {
          console.warn(`⚠️ Missing required field: ${field}`);
          missingFields.push(field);
        }
      });

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Add image if available
      if (image) {
        formData.append('image', {
          uri: image.uri,
          type: image.type || 'image/jpeg',
          name: image.fileName || 'profile.jpg'
        });
      }

      // Add user info (already added as captured_by above)
      // No need to append it again

      // Log the form data being sent
      console.log('Form data parts:');
      if (formData._parts) {
        formData._parts.forEach(([key, value]) => {
          console.log(`${key}:`, value);
        });
      } else {
        console.log('No form data parts found');
      }

      // Make the API request
      const apiUrl = 'https://api.ranchid.app/api/enumerator/add_livestock_keeper';
      console.log('Making request to:', apiUrl);
      console.log('Request method: POST');

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
        // Get token from AsyncStorage
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Log the token (first 10 chars for security)
        console.log('Using token:', token ? `${token.substring(0, 10)}...` : 'No token');

        // Create fetch options
        const fetchOptions = {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            // Let the browser set the Content-Type with boundary for FormData
          },
          body: formData,
        };

        // Log fetch options with redacted token
        console.log('Fetch options:', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ***',
            'Content-Type': 'multipart/form-data'
          },
          body: formData._parts
        });

        // Make the API request with a timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.log('Request timed out after 30 seconds');
          controller.abort();
        }, 30000);

        fetchOptions.signal = controller.signal;

        console.log('Sending request...');
        const startTime = Date.now();

        response = await fetch(apiUrl, fetchOptions);

        clearTimeout(timeoutId);
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        console.log(`Request completed in ${responseTime}ms`);
        console.log('Response status:', response.status, response.statusText);

        // Log response headers
        console.log('Response headers:');
        response.headers.forEach((value, key) => {
          console.log(`  ${key}: ${value}`);
        });

        // Get response as text first
        const responseText = await response.text();
        console.log('Raw response text length:', responseText.length);
        console.log('Response text (first 500 chars):', responseText.substring(0, 500));

        // Try to parse as JSON if possible
        try {
          responseData = responseText ? JSON.parse(responseText) : {};
          console.log('Successfully parsed JSON response:', JSON.stringify(responseData, null, 2));

          // Check for error messages in the response
          if (!response.ok) {
            let errorMessage = 'Request failed';

            // Handle validation errors
            if (response.status === 422 && responseData.errors) {
              const errorMessages = [];

              // Format validation errors into user-friendly messages
              Object.entries(responseData.errors).forEach(([field, errors]) => {
                errors.forEach(error => {
                  if (error === 'validation.unique') {
                    errorMessages.push(`${field} is already in use`);
                  } else if (error === 'validation.required') {
                    errorMessages.push(`${field} is required`);
                  } else if (error === 'validation.string') {
                    errorMessages.push(`${field} must be a valid string`);
                  } else {
                    errorMessages.push(`${field}: ${error}`);
                  }
                });
              });

              errorMessage = errorMessages.join('\n');
            } else {
              errorMessage = responseData.message || responseData.error || 'Request failed';
            }

            console.error('API request failed with status:', response.status);
            console.error('Response data:', responseData);
            throw new Error(errorMessage);
          }
        } catch (jsonError) {
          console.warn('Failed to parse JSON response:', jsonError);
          console.warn('Response content type:', response.headers.get('content-type'));
          throw new Error('Failed to process server response');
        }
      } catch (error) {
        console.error('Error making API request:', error);
        throw error;
      }

      if (!response.ok) {
        console.error('API request failed with status:', response.status);
        console.error('Response data:', responseData);

        let errorMessage = `HTTP error! status: ${response.status}`;

        if (responseData && responseData.message) {
          errorMessage = responseData.message;
          console.error('Error from server:', errorMessage);
        } else if (responseData && responseData.errors) {
          // Handle validation errors
          const errorMessages = Object.entries(responseData.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('\n');
          errorMessage = `Validation failed:\n${errorMessages}`;
          console.error('Validation errors:', errorMessages);
        }

        throw new Error(errorMessage);
      }

      console.log('Form submitted successfully!');
      console.log('Response data:', responseData);

      // Clear the step 1 data from storage
      try {
        await AsyncStorage.removeItem('livestockKeeperStep1');
        console.log('Removed livestockKeeperStep1 from AsyncStorage');
      } catch (storageError) {
        console.warn('Failed to remove livestockKeeperStep1:', storageError);
      }

      console.log('Navigating to success screen...');
      Alert.alert('Success', 'Livestock keeper registered successfully', [
        {
          text: 'OK',
          onPress: () => {
            console.log('User acknowledged success, navigating to success screen');
            router.replace('/(auth)/addLiveStockKeeper/success');
          }
        }
      ]);
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

      // Handle logout if needed (after showing the error)
      if (shouldLogout) {
        try {
          await AsyncStorage.multiRemove(['userToken', 'livestockKeeperStep1', 'userData', 'user']);
          router.replace('/');
        } catch (storageError) {
          console.error('Error clearing storage:', storageError);
        }
      }
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