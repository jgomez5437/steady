import { useState, type FormEvent } from 'react';
import { supabase } from '../../../shared/api/supabaseClient';
import { isValidEmail, isValidPassword } from '../lib/validation';

type Mode = 'sign-in' | 'sign-up';

export function AuthForm() {
  const [mode, setMode] = useState<Mode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setNotice('');

    if (!isValidEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }
    if (!isValidPassword(password)) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    const { error: authError } =
      mode === 'sign-in'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
    setSubmitting(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    if (mode === 'sign-up') {
      setNotice('Check your email to confirm your account, then log in.');
    }
  }

  function toggleMode() {
    setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in');
    setError('');
    setNotice('');
  }

  return (
    <div className="card">
      <h2>{mode === 'sign-in' ? 'Log in' : 'Create an account'}</h2>
      <p className="sub">
        {mode === 'sign-in' ? 'Welcome back.' : 'Your readings and recipes stay tied to your account.'}
      </p>
      <form className="reading-form" onSubmit={handleSubmit}>
        <div className="field grow">
          <label htmlFor="authEmail">Email</label>
          <input
            type="email"
            id="authEmail"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field grow">
          <label htmlFor="authPassword">Password</label>
          <input
            type="password"
            id="authPassword"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="field">
          <button type="submit" className="primary" disabled={submitting}>
            {mode === 'sign-in' ? 'Log in' : 'Sign up'}
          </button>
        </div>
      </form>
      <div className="error-msg" role="alert">{error}</div>
      {notice && <p className="sub">{notice}</p>}
      <button type="button" className="link" onClick={toggleMode}>
        {mode === 'sign-in' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
      </button>
    </div>
  );
}
