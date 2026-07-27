import { Navigate } from "react-router-dom";

import LoginForm from "../components/auth/LoginForm";
import AuthHero from "../components/layout/AuthHero";

import { useAuth } from "../context/AuthContext";



const Login = () => {
  const { loading,isAuthenticated } = useAuth();

  if(loading){
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if(isAuthenticated){
    return <Navigate to="/dashboard" replace />
  }





  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* Background Blur 1 */}
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />

      {/* Background Blur 2 */}
      <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-violet-200/40 blur-3xl" />

      {/* Main Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-10">
        {/* Left Side */}
        <AuthHero />

        {/* Right Side */}
        <div className="w-full lg:w-1/2">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;