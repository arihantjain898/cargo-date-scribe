
import React from 'react';
import FirebaseAuthWrapper from '../components/FirebaseAuthWrapper';
import FreightTracker from '../components/FreightTracker';

const Index = () => {
  console.log("Index component rendering");
  return (
    <FirebaseAuthWrapper>
      <FreightTracker />
    </FirebaseAuthWrapper>
  );
};

export default Index;
