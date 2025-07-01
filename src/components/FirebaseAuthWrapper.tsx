
import React from 'react';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FreightTracker from './FreightTracker';
import FreightTrackerWithLocalStorage from './FreightTrackerWithLocalStorage';

interface FirebaseAuthWrapperProps {
  children: React.ReactNode;
}

const FirebaseAuthWrapper: React.FC<FirebaseAuthWrapperProps> = ({ children }) => {
  const { user, loading, signIn, signUp, logout } = useFirebaseAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isSignUp, setIsSignUp] = React.useState(false);

  // BYPASS AUTH FOR TESTING - set to false to use Firebase authentication
  const BYPASS_AUTH = true;

  if (loading && !BYPASS_AUTH) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // If bypassing auth, use localStorage version
  if (BYPASS_AUTH) {
    return (
      <div>
        <div className="bg-yellow-100 border-b p-4 flex justify-between items-center">
          <span className="text-yellow-800 font-medium">🚧 Testing Mode - Using localStorage (Firebase Auth Bypassed)</span>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            size="sm"
          >
            Refresh
          </Button>
        </div>
        <FreightTrackerWithLocalStorage useLocalStorage={true} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{isSignUp ? 'Sign Up' : 'Sign In'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              onClick={() => isSignUp ? signUp(email, password) : signIn(email, password)}
              className="w-full"
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full"
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // When authenticated, use Firebase version
  return (
    <div>
      <div className="bg-white border-b p-4 flex justify-between items-center">
        <span>Welcome, {user.email}</span>
        <Button onClick={logout} variant="outline" size="sm">
          Sign Out
        </Button>
      </div>
      <FreightTracker />
    </div>
  );
};

export default FirebaseAuthWrapper;
