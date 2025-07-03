import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { images } from '../constant'
import { SafeAreaView } from 'react-native-safe-area-context'
import InputField from '../components/InputField'
import CustomButton from '../components/CustomButton'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateForm = () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    try {
      console.log('Attempting login...');
      const response = await fetch('https://api.ranchid.app/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          useremail: email.trim(),
          password: password,
          type: "ENUMERATOR"
        })
        
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok) {
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));

        // Retrieve and log the stored token
        const storedToken = await AsyncStorage.getItem('userToken');
        console.log('Stored Token After Login:', storedToken);

        router.replace('/(dashboard)/dashboard');
      } else {
        setError(data.message || "Invalid login credentials");
      }
    } catch (error) {
      console.error('Login error:', error);
      setError("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="h-full bg-[#FAF7F1]">
      <ScrollView className="px-4 my-8" >
        <View className='flex items-start justify-center'>
          <Image source={images.logo} />
          <Text className='text-[#282828] text-[22px] mt-4 font-bold font-Inter'>Log In</Text>
          <Text className='text-[#282828] text-[18px] text-start font-medium mt-4'>National Animal Identification and Traceability System</Text>
        </View>
        <View className='mt-10'>
          {error ? (
            <Text className="text-red-500 mb-4 text-center">{error}</Text>
          ) : null}
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(value) => {
              setEmail(value);
              setError("");
            }}
            placeholder="Enter your email address"
          />
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(value) => {
              setPassword(value);
              setError("");
            }}
            placeholder="Enter your password"
          />
          <TouchableOpacity
            className='mt-2'
            onPress={() => router.push('/forgot-password')}
          >
            <Text className='text-[#282828] font-medium text-[14px] underline'>I forgot my password</Text>
          </TouchableOpacity>
        </View>
        <View className='mt-10'>
          <CustomButton
            title={isLoading ? "Logging in..." : "Log In"}
            handlePress={handleLogin}
            // handlePress={() => router.push('/(auth)/tagLiveStock')}
            disabled={isLoading}
          />
        </View>

        <View className='flex-row items-center justify-center gap-4' style={{ marginTop: 70 }}>
          <Image
            source={images.group}
            className='w-[98px] h-[98px]'
          />
          <View style={{ marginLeft: 20 }}>
          <Image
            source={images.Naits}
            className='w-[98px] h-[98px]'
          />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}