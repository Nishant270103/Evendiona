// src/components/GoogleLoginButton.jsx
import { GoogleLogin } from '@react-oauth/google';

export default function GoogleLoginButton({ 
  onSuccess, 
  onError, 
  text = "continue_with", 
  disabled = false 
}) {
  const handleSuccess = (credentialResponse) => {
    console.log('✅ Google login success:', credentialResponse);
    if (onSuccess) {
      onSuccess(credentialResponse);
    }
  };

  const handleError = (error) => {
    console.error('❌ Google login error:', error);
    if (onError) {
      onError(error);
    }
  };

  return (
    <div className={`w-full ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        theme="outline"
        size="large"
        text={text}
        shape="rectangular"
        width="100%"
        useOneTap={false}
        auto_select={false}
        cancel_on_tap_outside={false}
        // ✅ Key props to fix COOP issues
        ux_mode="popup"
        context="signin"
        // ✅ Disable FedCM to avoid COOP conflicts
        use_fedcm_for_prompt={false}
        // ✅ Custom styling
        logo_alignment="left"
        locale="en"
      />
    </div>
  );
}
