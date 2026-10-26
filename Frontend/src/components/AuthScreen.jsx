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
