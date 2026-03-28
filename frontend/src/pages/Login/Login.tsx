import { Navigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';

import { useAuth } from '../../hooks/useAuth';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
      />
    </svg>
  );
}

export default function Login() {
  const { user, login } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-[100dvh] grid grid-cols-1 md:grid-cols-2">
      {/* Left panel — brand */}
      <div className="hidden md:flex flex-col justify-between p-12 bg-foreground text-background">
        <div>
          <span className="text-lg font-semibold tracking-tight">UDAS</span>
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tighter leading-none">
            Member
            <br />
            Management
          </h1>
          <p className="text-base text-background/60 max-w-[30ch] leading-relaxed">
            Secure access to organization records. Powered by Google OAuth.
          </p>
        </div>
        <p className="text-sm text-background/40">UDAS &mdash; {currentYear}</p>
      </div>

      {/* Right panel — sign in */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm space-y-8">
          <div className="md:hidden">
            <span className="text-lg font-semibold tracking-tight">UDAS</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">Sign in</h2>
            <p className="text-sm text-muted-foreground">
              Use your organization Google account to continue
            </p>
          </div>
          <Button onClick={login} size="lg" className="w-full gap-3">
            <GoogleIcon />
            Continue with Google
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            By signing in you agree to your organization&apos;s access policy.
          </p>
        </div>
      </div>
    </div>
  );
}
