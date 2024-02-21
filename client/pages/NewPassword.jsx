import { useState } from 'react';
import NewPassword from '@/components/Account/ForgotPassword/NewPassword';
import { useRouter } from 'next/router';

const NewPasswordPage = () => {
  const router = useRouter();
  const { phone } = router.query;
  console.log('valuePhoneNewPasswordPAGE', phone)
  return <NewPassword onSendPhoneToVerify={phone} />;
};

export default NewPasswordPage;

