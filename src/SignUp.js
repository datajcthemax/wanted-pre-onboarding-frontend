import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp() {
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
      const response = await fetch('https://www.pre-onboarding-selection-task.shop/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(`Signup failed: ${response.status}, ${JSON.stringify(errorResponse)}`);
      }

      navigate('/signin');
    } catch (error) {
      console.error('Error during signup:', error);
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
      <button type="submit" data-testid="signup-button" disabled={!isEmailValid || !isPasswordValid}>Sign Up</button>
    </form>
  );
}

export default SignUp;


