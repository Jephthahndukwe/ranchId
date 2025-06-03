import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const DashboardLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name='dashboard'
          options={{
            headerShown: false
          }}
        />
        {/* <Stack.Screen
          name='profile'
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='settings'
          options={{
            headerShown: false
          }}
        /> */}
      </Stack>
    </>
  )
}

export default DashboardLayout