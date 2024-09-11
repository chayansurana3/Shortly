import React, { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { MoonIcon, SunIcon } from '@heroicons/react/solid'; // Import Moon and Sun icons

export default function NavBar(props) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isDarkModeOn, setDarkMode] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const logOut = () => props.logOut();

    const toggleMode = () => {
        const newMode = !isDarkModeOn;
        setDarkMode(newMode);
        localStorage.setItem('mode', newMode ? 'true' : 'false');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setDropdownOpen(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const savedMode = localStorage.getItem('mode') === 'true';
        setDarkMode(savedMode);
    }, []);

    useEffect(() => {
        if (isDarkModeOn) document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
    }, [isDarkModeOn]);

    return (
        <div className="flex flex-row items-center justify-between w-full px-8 border-b-2 border-b-gray-300 dark:bg-black dark:text-white dark:border-none">
            <div className="flex-1 flex items-center">
                <Link to="/" className="font-bold text-4xl p-6 ml-12 hover:text-teal-400 dark:hover:text-blue-500">Shortly</Link>
                <ul className="flex flex-row p-8 pt-9">
                    <li><Link to="/" className="p-6 text-lg font-semibold text-gray-400 hover:text-black dark:hover:text-blue-500 dark:text-white">Features</Link></li>
                    <li><Link to="/" className="p-6 text-lg font-semibold text-gray-400 hover:text-black dark:hover:text-blue-500 dark:text-white">Pricing</Link></li>
                    <li><Link to="/" className="p-6 text-lg font-semibold text-gray-400 hover:text-black dark:hover:text-blue-500 dark:text-white">Resources</Link></li>
                </ul>
            </div>
            <div className="mr-2">
                <button onClick={toggleMode} className={`w-10 h-10 flex items-center justify-center rounded-full duration-300 hover:scale-110 ease-in-out transition-all ${isDarkModeOn ? 'bg-gray-100 text-gray-700' : 'bg-gray-800 text-white'}`}>
                    {isDarkModeOn ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                </button>
            </div>
            {!props.loggedIn ?
                <div className="flex flex-row items-center">
                    <Link to="/login" className="px-6 py-2 font-semibold text-gray-400 hover:text-black dark:text-white dark:hover:text-blue-500">Login</Link>
                    <Link to="/signup" className="px-6 py-2 bg-teal-400 font-semibold text-white rounded-2xl ml-2 hover:bg-teal-500 hover:transition hover:ease-in-out hover:duration-300 hover:scale-110 dark:bg-blue-400">Sign Up</Link>
                </div>
                :
                <div className="relative" ref={dropdownRef}>
                    <button onClick={toggleDropdown} className="px-6 py-2 bg-teal-400 font-semibold text-white rounded-3xl hover:bg-teal-500 hover:transition hover:ease-in-out hover:duration-300 hover:scale-110 dark:bg-blue-400">
                        {props.userName ? props.userName : <span>My Account</span>}
                    </button>
                    {dropdownOpen && (
                        <div className="text-md font-semibold absolute right-0 text-center mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col items-center">
                            <Link to="/account" className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-center">My Data</Link>
                            <Link to="/forgotPass" className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-center">Reset Password</Link>
                            <button onClick={logOut} className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-center">Logout</button>
                        </div>
                    )}
                </div>
            }
        </div>
    );
}