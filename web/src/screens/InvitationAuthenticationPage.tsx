import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const InterviewVerifyPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');

    if (accessToken) {
      fetch('/auth/invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: accessToken }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            sessionStorage.setItem('sessionToken', data.sessionToken);
            navigate('/interview');
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }, [navigate]);

  return <div>Verifying...</div>;
};

export default InterviewVerifyPage;
