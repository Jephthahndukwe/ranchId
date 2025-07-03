import React from 'react';
import SuccessScreen from '../../../components/SuccessScreen';
import { useLocalSearchParams } from 'expo-router';

export default function Success() {
    const { tagId } = useLocalSearchParams();
  return (
    <SuccessScreen
      title="Good Job!"
      message={`${tagId} Tagged Successfully`}
      buttonText="Go back to dashboard"
    />
  );
}