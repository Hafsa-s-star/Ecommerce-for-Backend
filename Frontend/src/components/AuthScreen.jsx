import { useState } from 'react';
import { Leaf, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { api, storeSession } from '../authStorage';

export function AuthScreen({ onAuthenticated, initialError = '' }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(initialError);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectMode = (nextMode) => {
    setMode(nextMode);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      if (mode === 'register') {
        if (!name.trim()) {
          setError('Please enter your name.');
          return;
        }
        const response = await api.post('/auth/register', {
          username: name.trim(),
          email: normalizedEmail,
          password,
        });
        onAuthenticated(storeSession(response.data.user));
      } else {
        const response = await api.post('/auth/login', { email: normalizedEmail, password });
        onAuthenticated(storeSession(response.data.user));
      }
    } catch (submitError) {
      console.error('Unable to complete FreshMarket sign in.', submitError);
      setError(submitError.response?.data?.message || 'We could not connect to the account service. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="auth-title">
        <a className="auth-brand" href="#" onClick={(event) => event.preventDefault()}>
          <span className="auth-brand-mark"><Leaf size={22} /></span>
          <span>Fresh<span>Market</span></span>
        </a>
        <div className="auth-intro">
          <span className="auth-eyebrow">Good food, made simple</span>
          <h1 id="auth-title">{mode === 'register' ? 'Create your account' : 'Welcome back'}</h1>
          <p>{mode === 'register' ? 'Join us for fresh finds from local growers.' : 'Sign in to explore today’s fresh harvest.'}</p>
        </div>

        <div className="auth-tabs" role="tablist" aria-label="Account access">
          <button type="button" role="tab" aria-selected={mode === 'login'} className={mode === 'login' ? 'selected' : ''} onClick={() => selectMode('login')}>Sign in</button>
          <button type="button" role="tab" aria-selected={mode === 'register'} className={mode === 'register' ? 'selected' : ''} onClick={() => selectMode('register')}>Create account</button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label>
              Full name
              <input autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" />
            </label>
          )}
          <label>
            Email address
            <input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
          </label>
          <label>
            Password
            <span className="password-field">
              <input type={showPassword ? 'text' : 'password'} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} minLength={mode === 'register' ? 8 : undefined} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder={mode === 'register' ? 'At least 8 characters' : 'Enter your password'} />
              <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </span>
          </label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait…' : mode === 'register' ? 'Create account' : 'Sign in'}
            <ArrowRight size={17} />
          </button>
        </form>

        <div className="auth-divider"><span>or continue with</span></div>
        <a className="google-sign-in" href={api.getUri({ url: '/auth/google' })}>
          <svg aria-hidden="true" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.75 7.18l7.73 6C44.43 38.05 46.98 31.84 46.98 24.55Z" />
            <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.75-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.88.93 7.55 2.56 10.78l7.97-6.19Z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.45-4.89 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
          </svg>
          <span>Continue with Google</span>
        </a>

        <div className="demo-note">
          <ShieldCheck size={17} />
          <div>
            <strong>Secure account access</strong>
            <span>Your sign-in is verified by FreshMarket.</span>
          </div>
        </div>
        <p className="auth-disclaimer">Your account and access level are managed by the store server.</p>
      </section>
    </main>
  );
}

export default AuthScreen;
