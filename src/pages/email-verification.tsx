import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useVerifyEmail } from '@/framework/user';

const VerifyEmail = () => {
  const router = useRouter();
  const { token } = router.query; // Extract the token from the dynamic route

  const {mutate: verifyEmail,isLoading } = useVerifyEmail()


  useEffect(() => {
    if (token) {
        const tokenString = Array.isArray(token) ? token[0] : token;
        verifyEmail({token: tokenString ?? ""});
    }
  }, [token, router]);

  return (
    <div className="verify-email">
      <h1>Email Verification</h1>
      {isLoading ? (
        <p>Verifying your email, please wait...</p>
      ) : (
        <p>{}</p>
      )}
    </div>
  );
};

export default VerifyEmail;
