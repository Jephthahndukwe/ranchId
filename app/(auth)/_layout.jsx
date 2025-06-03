import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name='register'
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='addLivestockKeeper'
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='addLivestockOwner'
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='tagLiveStock'
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='addLocation'
          options={{
            headerShown: false
          }}
        />
      </Stack>
    </>
  )
}

export default AuthLayout

const styles = StyleSheet.create({})