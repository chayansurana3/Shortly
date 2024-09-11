import React, { useState } from 'react';
import { auth, signInWithEmailAndPassword, googleProvider, signInWithPopup } from '../firebase';

const LoginPage = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [invalidCredentials, setInvalidCredentials] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      props.login();
      console.log('User logged in:');
    } catch (error) {
      setInvalidCredentials(true);
      console.error('Error logging in:', error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      props.login();
      console.log('Google login success:');
    } catch (error) {
      console.error('Error with Google login:', error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-teal-400 dark:from-gray-400 dark:to-gray-600">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-semibold text-center text-gray-700">Login</h2>
        {invalidCredentials ? <p className='text-red-500 text-sm'>Please check your username and password. If you do you not have an account create a new account</p> : null}

        <form onSubmit={handleLogin} className="space-y-5 mt-4">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="text-sm text-gray-600">Email Address</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Enter your email" />
          </div>

          {/* Password Field */}
          <div className='relative'>
            <label htmlFor="password" className="text-sm text-gray-600">Password</label>
            <input type={passwordVisible ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Enter your password" />
            <button type="button" className="absolute inset-y-0 right-0 p-3 pt-10 flex items-center" onClick={togglePasswordVisibility} >
              {!passwordVisible ? (<span>🔒</span>) : (<span>🔓</span>)}
            </button>
          </div>

          {/* Login Button */}
          <div>
            <button type="submit" className="hover:ease-in-out hover:scale-105 w-full p-3 text-white bg-blue-500 font-semibold rounded-lg hover:bg-blue-600 transition-all duration-300" >Sign In</button>
          </div>
        </form>

        <div className="flex items-center justify-between m-4">
          <hr className="w-full border-gray-300" />
          <span className="text-sm text-gray-500 px-2">or</span>
          <hr className="w-full border-gray-300" />
        </div>

        {/* Google Login Button */}
        <div className="flex justify-center mb-4">
          <button onClick={handleGoogleLogin} className="w-full p-3 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-all duration-300" >
            <img className='w-5 h-5 mr-3' src="https://www.vectorlogo.zone/logos/google/google-icon.svg" alt='Google login icon'></img>
            <span className="text-gray-700 font-medium">Sign in with Google</span>
          </button>
        </div>

        {/* Extra Links */}
        <div className="mt-6 flex justify-between text-sm text-gray-600">
          <a href="/forgotPass" className="hover:text-blue-500">Forgot Password?</a>
          <a href="/signup" className="hover:text-blue-500">Create an Account</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
