import { useState } from 'react';
import ForgotPassWord from "../components/Account/ForgotPassWord/ForgotPassWord";
import { useRouter } from 'next/router';
const ForgotPasswordPage = () => {
  const [valuePhone, setvaluePhone] = useState("");
  const router = useRouter();
  
  const receivePhoneHandler = (phone) => {
    console.log('receivePhoneHandler has been called with FORGOT PASSWORD PAGE', phone);
    setvaluePhone(phone);
    router.push({
      pathname: '/NewPassword',
      query: { phone: phone }
    });
  };

  return <ForgotPassWord onSendPhoneToPage={receivePhoneHandler} />;
};

export default ForgotPasswordPage;