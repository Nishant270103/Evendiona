// src/components/GoogleLoginButton.jsx

import { GoogleLogin } from '@react-oauth/google';

export default function GoogleLoginButton({ onSuccess, onError }) {
  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
        theme="outline"
        size="large"
        text="continue_with"
        shape="rectangular"
        width="300"
      />
    </div>
  );
}
