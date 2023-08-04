import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Todo() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      navigate('/signin');
    }
  }, [navigate]);

}

export default Todo;
