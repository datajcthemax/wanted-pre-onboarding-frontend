import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
  
    useEffect(() => {
      const token = localStorage.getItem('jwt');
      if (token) {
        navigate('/todo');
      }
    }, [navigate]);

  const isEmailValid = email.includes('@');
  const isPasswordValid = password.length >= 8;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    try {
      const response = await fetch('https://www.pre-onboarding-selection-task.shop/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(`Signin failed: ${response.status}`);
      }

      const { jwt } = await response.json();
      localStorage.setItem('jwt', jwt);
      navigate('/todo');
    } catch (error) {
      console.error('Error during signin:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required data-testid="email-input" />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required data-testid="password-input" />
      </label>
      <button type="submit" data-testid="signin-button" disabled={!isEmailValid || !isPasswordValid}>Sign In</button>
    </form>
  );
}

export default SignIn;


