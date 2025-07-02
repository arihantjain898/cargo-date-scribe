
import FreightTracker from '../components/FreightTracker';
import FirebaseAuthWrapper from '../components/FirebaseAuthWrapper';

const Index = () => {
  console.log("Index component rendering");
  return (
    <FirebaseAuthWrapper>
      <FreightTracker />
    </FirebaseAuthWrapper>
  );
};

export default Index;
