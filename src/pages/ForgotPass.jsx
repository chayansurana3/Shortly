import React, { useState, useEffect } from 'react';
import { sendPasswordResetEmail, getAuth } from 'firebase/auth';
import Swal from 'sweetalert2';

export default function ForgotPass() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentUserEmail, setCurrentUserEmail] = useState('');

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const auth = getAuth(); // Get the Firebase Auth instance

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setCurrentUserEmail(user.email);
        }
    }, [auth]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validate email format
        if (!emailRegex.test(email)) {
            setLoading(false);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Invalid Email"
            });
            return;
        }

        // Check if entered email matches the current user's email
        if (email !== currentUserEmail) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "The email address does not match your account"
            });
            setLoading(false);
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            Swal.fire({
                icon: 'success',
                title: 'Email Sent!',
                text: 'Please check your email to reset your password.',
            });
        } catch (error) {
            console.error('Error sending password reset email:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to send password reset email. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100 bg-gradient-to-r dark:from-gray-200 dark:to-gray-600">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-teal-400 text-white py-2 px-4 rounded-lg hover:bg-teal-500 disabled:opacity-50 dark:bg-blue-500 hover:scale-110 transition-all duration-300"
                    >
                        {loading ? 'Sending...' : 'Send Reset Email'}
                    </button>
                </form>
            </div>
        </div>
    );
}
