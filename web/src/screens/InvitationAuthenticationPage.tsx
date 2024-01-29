import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { axiosInstance } from '@/lib/axios';

const InterviewVerifyPage = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const interviewId = params.get('interview_id');

    if (accessToken) {
      axiosInstance
        .post('/auth/invitation', { token: accessToken })
        .then(response => {
          console.log('DATA: ', response.data);
          if (response.data.status === 'success') {
            sessionStorage.setItem(
              'sessionToken',
              response.data.payload.session_token
            );
            navigate(`/interviews/${interviewId}/record`);
          }
        })
        .catch(error => {
          setErrorMessage(error.response.data.message);
        });
    }
  }, [navigate]);

  if (errorMessage) {
    return <div>Error: {errorMessage}</div>;
  }

  return <div>Verifying...</div>;
};

export default InterviewVerifyPage;
