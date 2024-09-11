import React, { useState } from 'react';
import { auth, updateProfile, createUserWithEmailAndPassword, googleProvider, signInWithPopup } from '../firebase'; 
import Swal from 'sweetalert2';

export default function SignUp(props) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
    const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);

    const handleSignUp = async (e) => {
        e.preventDefault();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (password !== confirmPassword) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Passwords do not match"
            });
            return;
        }
        
        if (!emailRegex.test(email)){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Invalid Email"
            });
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: name  
            });
    
            console.log('User signed up and name saved:', user.displayName);
            console.log('User signed up:');
            props.login();
            // Handle successful sign-up here (e.g., redirect or show a success message)
        } catch (error) {
            console.error('Error signing up:', error);
            // Handle error here (e.g., show an error message)
        }
    };

    const handleGoogleSignUp = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log('User signed up with Google:');
            props.login();
            // Handle successful sign-up with Google here
        } catch (error) {
            console.error('Error signing up with Google:', error);
            // Handle error here
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-teal-400 dark:from-gray-400 dark:to-gray-600">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md m-7">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Create an Account</h2>

                <form onSubmit={handleSignUp} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your name" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" />
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type={passwordVisible ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter a strong password" />
                        <button type="button" className="absolute inset-y-0 right-0 p-3 pt-8 flex items-center" onClick={togglePasswordVisibility} >
                            {!passwordVisible ? (<span>🔒</span>) : (<span>🔓</span>)}
                        </button>
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input type={confirmPasswordVisible ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Confirm your password" />
                        <button type="button" className="absolute inset-y-0 right-0 p-3 pt-8 flex items-center" onClick={toggleConfirmPasswordVisibility} >
                            {!confirmPasswordVisible ? (<span>🔒</span>) : (<span>🔓</span>)}
                        </button>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 ease-in-out hover:scale-105 text-white py-2 px-4 rounded-md shadow hover:bg-blue-700 transition duration-300" >Sign Up</button>

                    <div className="flex items-center justify-center">
                        <div className="w-full border-t border-gray-300"></div>
                        <span className="px-2 text-gray-500">or</span>
                        <div className="w-full border-t border-gray-300"></div>
                    </div>

                    <button type="button" onClick={handleGoogleSignUp} className="w-full flex items-center justify-center bg-white text-gray-600 border border-gray-300 rounded-md shadow-sm py-2 px-4 mt-0 hover:bg-gray-100 transition duration-300" >
                        <img className='w-5 h-5 m-1 mr-3' src="https://www.vectorlogo.zone/logos/google/google-icon.svg" alt="Google icon" />
                        Sign Up with Google
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">Already have an account?{' '}<a href="/login" className="text-blue-600 hover:text-blue-700">Log In</a></p>
            </div>
        </div>
    );
};
