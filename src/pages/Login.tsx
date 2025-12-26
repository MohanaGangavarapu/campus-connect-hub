// Login Page - handles user authentication
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { loginUser } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Mail, Lock, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login: React.FC = () => {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Hooks
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please enter both email and password',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Call login API
      const response = await loginUser(email, password);

      // Save token and user info
      login(response.token, response.user);

      // Show success message
      toast({
        title: 'Welcome!',
        description: `Logged in as ${response.user.name}`,
      });

      // Redirect based on role
      if (response.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    } catch (error: unknown) {
      // Handle login error
      const errorMessage = 
        error instanceof Error ? error.message : 'Invalid email or password';
      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login function (for testing without backend)
  const handleDemoLogin = (role: 'student' | 'admin') => {
    const demoUser = {
      id: '1',
      email: role === 'admin' ? 'admin@campus.edu' : 'student@campus.edu',
      name: role === 'admin' ? 'Admin User' : 'John Doe',
      role: role,
    };
    login('demo-token-12345', demoUser);
    toast({
      title: 'Demo Mode',
      description: `Logged in as ${role}`,
    });
    navigate(role === 'admin' ? '/admin' : '/student');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Smart Campus</CardTitle>
            <CardDescription>Sign in to access your dashboard</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or try demo</span>
            </div>
          </div>

          {/* Demo Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDemoLogin('student')}
            >
              Demo Student
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDemoLogin('admin')}
            >
              Demo Admin
            </Button>
          </div>

          {/* Note about demo */}
          <p className="text-xs text-center text-muted-foreground">
            Use demo buttons to explore the app without a backend
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
