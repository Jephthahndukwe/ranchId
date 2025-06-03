import { Stack } from 'expo-router';
import React from 'react';

export default function ReportsLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="livestock-owner"
        options={{
          title: 'Livestock Owner List',
          headerStyle: {
            backgroundColor: '#FAF7F1',
          },
        }}
      />
      <Stack.Screen 
        name="livestock-keeper"
        options={{
          title: 'Livestock Keeper List',
          headerStyle: {
            backgroundColor: '#FAF7F1',
          },
        }}
      />
      <Stack.Screen 
        name="tag-report"
        options={{
          title: 'Tag Report',
          headerStyle: {
            backgroundColor: '#FAF7F1',
          },
        }}
      />
      <Stack.Screen 
        name="location-report"
        options={{
          title: 'Location Report',
          headerStyle: {
            backgroundColor: '#FAF7F1',
          },
        }}
      />
    </Stack>
  );
}
