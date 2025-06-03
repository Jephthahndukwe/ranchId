import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';

export default function TagReport() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const response = await fetch('https://api.ranchid.app/api/enumerator/list_tagged_livestock', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const text = await response.text();
      console.log('Raw API Response (Tags):', text);
      
      let data;
      try {
        data = JSON.parse(text);
        console.log('Parsed Response (Tags):', data);
      } catch (parseError) {
        console.error('Response parsing error:', text);
        throw new Error('Invalid response format from server');
      }

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to fetch tagged livestock');
      }

      if (!data?.record?.data) {
        console.error('Unexpected data structure:', data);
        throw new Error('Invalid response format: missing record.data');
      }

      setTags(data.record.data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'An error occurred while fetching the data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#FAF7F1]">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-[#FAF7F1] p-4">
        <Text className="text-red-500 text-center mb-4">{error}</Text>
        <TouchableOpacity
          className="bg-blue-500 py-2 px-4 rounded"
          onPress={fetchTags}
        >
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#FAF7F1]">
      <ScrollView className="flex-1 p-4">
        {tags.length === 0 ? (
          <Text className="text-center text-gray-500 mt-4">
            No tagged livestock found
          </Text>
        ) : (
          tags.map((tag, index) => (
            <View 
              key={tag.id} 
              className={`bg-white p-4 rounded-lg mb-4 ${
                index !== tags.length - 1 ? 'border-b border-gray-200' : ''
              }`}
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-lg font-semibold">Tag ID: {tag.tag_id}</Text>
                <Text className="text-sm text-gray-500">ID: {tag.id}</Text>
              </View>
              <View className="space-y-2">
                <Text className="text-gray-600">Animal Type: {tag.animal_type}</Text>
                <Text className="text-gray-600">Breed: {tag.breed}</Text>
                <Text className="text-gray-600">Sex: {tag.sex}</Text>
                <Text className="text-gray-600">Health Status: {tag.health_status}</Text>
                <Text className="text-gray-600">Birth Period: {tag.birth_period}</Text>
                <Text className="text-gray-600">Owner: {tag.owner_name}</Text>
                <Text className="text-gray-600">Location: {tag.location_name}</Text>
                
                <View className="mt-2">
                  <Text className="font-semibold mb-1">Verification Photo:</Text>
                  {tag.verification_photo ? (
                    <Image 
                      source={{ uri: tag.verification_photo }} 
                      className="w-full h-40 rounded"
                      resizeMode="cover"
                    />
                  ) : (
                    <Text className="text-gray-500">No verification photo</Text>
                  )}
                </View>
                
                <View className="mt-2">
                  <Text className="font-semibold mb-1">Vaccine Photo:</Text>
                  {tag.vaccine_photo ? (
                    <Image 
                      source={{ uri: tag.vaccine_photo }} 
                      className="w-full h-40 rounded"
                      resizeMode="cover"
                    />
                  ) : (
                    <Text className="text-gray-500">No vaccine photo</Text>
                  )}
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
