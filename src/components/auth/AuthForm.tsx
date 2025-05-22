import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../../lib/supabase';

const AuthForm = () => {
  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Welcome to TaskFlow AI
        </h2>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          theme="default"
        />
      </div>
    </div>
  );
};

export default AuthForm;