
import React from 'react';
import SlidingAuthContainer from './SlidingAuthContainer';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return <SlidingAuthContainer onLogin={onLogin} />;
};

export default LoginPage;
