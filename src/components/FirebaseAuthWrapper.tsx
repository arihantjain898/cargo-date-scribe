
import React from 'react';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Chrome } from 'lucide-react';

interface FirebaseAuthWrapperProps {
  children: React.ReactNode;
}

const FirebaseAuthWrapper: React.FC<FirebaseAuthWrapperProps> = ({ children }) => {
  const { user, loading, signIn, signInWithGoogle, logout } = useFirebaseAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
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
              onClick={() => signIn(email, password)}
              className="w-full"
            >
              Sign In
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={signInWithGoogle}
              className="w-full"
            >
              <Chrome className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>
            
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white border-b p-4 flex justify-between items-center">
        <span>Welcome, {user.email}</span>
        <Button onClick={logout} variant="outline" size="sm">
          Sign Out
        </Button>
      </div>
      {children}
    </div>
  );
};

export default FirebaseAuthWrapper;
