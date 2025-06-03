import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect } from 'react';
import SuccessScreen from '../../../components/SuccessScreen';
import { useNavigation } from 'expo-router';

const Success = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#FAF7F1]">
      <SuccessScreen
        title="Good Job!"
        message="Livestock keeper added successfully"
        buttonText="Go back to dashboard"
      />
    </SafeAreaView>
  );
};

export default Success;
