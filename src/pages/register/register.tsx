import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../../src/services/store';
import { useNavigate } from 'react-router-dom';
import {
  getIsAuthCheckedSelector,
  getUserSelector,
  registerUser
} from '../../../src/services/slices/userSlice';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(getUserSelector);
  const isAuthChecked = useSelector(getIsAuthCheckedSelector);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      registerUser({
        name: userName,
        email: email,
        password: password
      })
    );
  };

  useEffect(() => {
    if (user && isAuthChecked) {
      navigate('/profile', { replace: true });
    }
  }, [user, isAuthChecked, navigate]);

  return (
    <RegisterUI
      errorText=''
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
