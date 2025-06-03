import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';

export default function LocationReport() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const response = await fetch('https://api.ranchid.app/api/enumerator/list_locations', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const text = await response.text();
      console.log('Raw API Response (Locations):', text);
      
      let data;
      try {
        data = JSON.parse(text);
        console.log('Parsed Response (Locations):', data);
      } catch (parseError) {
        console.error('Response parsing error:', text);
        throw new Error('Invalid response format from server');
      }

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to fetch locations');
      }

      if (!data?.record?.data) {
        console.error('Unexpected data structure:', data);
        throw new Error('Invalid response format: missing record.data');
      }

      setLocations(data.record.data);
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
          onPress={fetchLocations}
        >
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#FAF7F1]">
      <ScrollView className="flex-1 p-4">
        {locations.length === 0 ? (
          <Text className="text-center text-gray-500 mt-4">
            No locations found
          </Text>
        ) : (
          locations.map((location, index) => (
            <View 
              key={location.id} 
              className={`bg-white p-4 rounded-lg mb-4 ${
                index !== locations.length - 1 ? 'border-b border-gray-200' : ''
              }`}
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-lg font-semibold">{location.name}</Text>
                <Text className="text-sm text-gray-500">ID: {location.id}</Text>
              </View>
              <View className="space-y-1">
                <Text className="text-gray-600">Type: {location.location_type}</Text>
                <Text className="text-gray-600">
                  Location: {location.state}, {location.lga}
                </Text>
                <Text className="text-gray-600">Address: {location.address}</Text>
                <Text className="text-gray-600">Owner: {location.owner_name}</Text>
                <View className="mt-2">
                  <Text className="font-semibold">Statistics:</Text>
                  <Text className="text-gray-600">Total Animals: {location.total_animals || 0}</Text>
                  <Text className="text-gray-600">Total Keepers: {location.total_keepers || 0}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
