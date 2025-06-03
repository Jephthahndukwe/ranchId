import React from 'react';
import SuccessScreen from '../../../components/SuccessScreen';

export default function LocationSuccess() {
  return (
    <SuccessScreen
      title="Location Added Successfully!"
      message="The livestock location has been successfully added to the system."
      buttonText="Back to Dashboard"
    />
  );
}
