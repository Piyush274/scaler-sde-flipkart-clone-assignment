import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/hooks/use-toast';
import { testLogin } from '@/services/api';
import { useCartStore } from '@/store/cartStore';

const Auth = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const login = useAuthStore((s) => s.login);
  const hydrateFromBackend = useCartStore((s) => s.hydrateFromBackend);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Min 6 characters';
    if (mode === 'signup' && password !== confirmPassword)
      errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const user = await testLogin();
      login({ id: user.id, email: user.email, name: user.name });
      await hydrateFromBackend();
      toast({ title: mode === 'login' ? 'Logged in!' : 'Account created!' });
      navigate(from, { replace: true });
    } catch {
      toast({ title: 'Login failed', variant: 'destructive' });
    }
  };

  const handleScalerLogin = async () => {
    try {
      const user = await testLogin();
      login({ id: user.id, email: user.email, name: user.name });
      await hydrateFromBackend();
      toast({ title: 'Logged in with Scaler AI!' });
      navigate(from, { replace: true });
    } catch {
      toast({ title: 'Login failed', variant: 'destructive' });
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-sm bg-card p-8 shadow-md">
        {/* Tabs */}
        <div className="mb-6 flex border-b border-border">
          {(['login', 'signup'] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setErrors({}); }}
              className={`flex-1 pb-3 text-sm font-bold uppercase tracking-wide transition-colors ${
                mode === m
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {m === 'login' ? 'Login' : 'Sign Up'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-sm border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-sm border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
            {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
          </div>
          {mode === 'signup' && (
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-sm border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-destructive">{errors.confirmPassword}</p>
              )}
            </div>
          )}
          <button
            type="submit"
            className="w-full rounded-sm bg-primary py-3 text-sm font-bold uppercase text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            {mode === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">OR</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <button
          onClick={handleScalerLogin}
          className="flex w-full items-center justify-center gap-2 rounded-sm border border-input bg-background py-3 text-sm font-bold text-foreground shadow-sm transition-colors hover:bg-muted"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">S</span>
          Login with Scaler AI
        </button>
      </div>
    </div>
  );
};

export default Auth;
