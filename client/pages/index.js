import { useRouter } from 'next/router';
import { useEffect } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';
import HomePage from './HomePage';
import ForgotPassword from './ForgotPassword';
import NotFoundPage from './NotFoundPage';
import { authentication } from '../components/Home/authenticaiton';

export default function App() {
  const router = useRouter();
  const isAuthenticated = authentication.isAuthencation();
  useEffect(() => {

    if (isAuthenticated) {
      router.push('/HomePage'); 
    } else {
      router.push('/SignIn'); 
    }
  }, []);


}