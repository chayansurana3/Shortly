import { React, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainPic from "../images/illustration-working.svg";
import InputImage from "../images/bg-shorten-desktop.svg";
import image1 from "../images/icon-brand-recognition.svg";
import image2 from "../images/icon-detailed-records.svg";
import image3 from "../images/icon-fully-customizable.svg";
import LastImage from "../images/bg-boost-desktop.svg";
import Swal from 'sweetalert2'
import { auth, ref, set, database } from '../firebase';

export default function Home() {
    
    const [errorMessage, setErrorMessage] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    // const [shortenedUrls, setShortenedUrls] = useState([]);
    const navigate = useNavigate();

    const scrollToShortener = (event) =>{
        event.preventDefault();
        document.getElementById('shorten-link-section')?.scrollIntoView({behavior: 'smooth'});
    }

    const isValidURL = (url) => {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    };
    
    const onSubmit = async (event) => {
        event.preventDefault();
        const url = document.getElementById('url-input').value;
      
        if (!isValidURL(url)) {
          setErrorMessage(true);
          console.log("Wrong URL");
          return;
        }
      
        console.log("Correct URL");
        setIsProcessing(true);
        setErrorMessage(false);
      
        try {
          const response = await fetch('/.netlify/functions/url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url }),
          });
      
          const data = await response.json();
      
          if (data.result_url) {
            console.log('Shortened URL:', data.result_url);
            const user = auth.currentUser;

            if (user) {
              const userId = user.uid; 
              const newUrlRef = ref(database, `users/${userId}/shortenedUrls/` + Date.now());      
              await set(newUrlRef, {
                originalUrl: url,
                shortenedUrl: data.result_url,
                date: new Date().toISOString(),
              });
      
              Swal.fire({
                html: `
                  <p class="text-2xl font-bold m-1">Shortened version of the URL:</p>
                  <p id="result-url" class="m-1 font-semibold text-lg text-blue-600">${data.result_url}</p>
                  <button id="copy-btn" class="swal2-confirm swal2-styled transition ease-in-out hover:scale-110 hover:duration-300">Copy to Clipboard</button>
                `,
                showConfirmButton: true,
                showCancelButton: false,
                didOpen: () => {
                  document.getElementById('copy-btn').addEventListener('click', () => {
                    const urlToCopy = document.getElementById('result-url').innerText;
                    navigator.clipboard.writeText(urlToCopy)
                      .then(() => Swal.fire('Copied to clipboard!', '', 'success'))
                      .catch((error) => console.error('Failed to copy:', error));
                  });
                }
              });
            } else {
              console.error('User is not authenticated');
            }
          } else {
            console.error('Error:', data.error);
          }
        } catch (error) {
          console.error('Request failed:', error);
        }
        
        setIsProcessing(false);
      };

    return (
        <div className="transition ease-in-out duration-700 dark:bg-blue-700 bg-white dark:text-white">
            <div className="flex flex-row">
                <div className="ml-auto flex-col flex">
                    <h1 className="p-28 pr-4 pb-2 text-7xl font-extrabold">More than just<br />shorten links</h1>
                    <p className="p-28 pt-2 pb-8 text-gray-400 text-wrap text-lg font-semibold dark:text-white dark:font-normal">Build your brand's recognition and get detailed insights on how your links are performing</p>
                    <a href="#shorten-link-section" onClick={scrollToShortener} className="bg-teal-400 mx-auto px-4 py-3 transition ease-in-out duration-300 hover:scale-110 text-white rounded-2xl font-bold hover:bg-teal-500 dark:bg-blue-500">Get Started</a>
                </div>
                <div className="ml-auto p-8">
                    <img src={MainPic} alt="Main pic" />
                </div>
            </div>
            <div id="shorten-link-section" className="mt-12 flex flex-col items-center bg-blue-950 pb-8" >
                <div className="rounded-lg flex p-10 pb-4 w-11/12" style={{ backgroundImage: `url(${InputImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <input id='url-input' placeholder="Shorten a link here" className="w-4/5 p-4 rounded-md" />
                    <button className="w-1/6 bg-teal-400 ml-4 p-4 transition ease-in-out duration-300 hover:scale-110 text-white font-bold hover:bg-teal-500 text-center" onClick={onSubmit}>Shorten It!
                        {isProcessing && <span id='button-processing' className="inline-flex items-center ml-2"><svg className="animate-spin h-5 w-5 mr-1 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"></path></svg></span>}
                    </button>
                </div>
                {errorMessage ? <p id="error-message" className="text-red-400">Incorrect URL. Please enter a legal URL</p> : null}
            </div>
            <div className="p-8 bg-gray-100 w-full flex flex-col pb-12 dark:bg-gray-700 dark:text-black">
                <h1 className="font-bold text-4xl pt-16 p-8 pb-0 mx-auto dark:text-white">Advanced Statistics</h1>
                <p className="text-gray-400 mx-auto p-6 text-center">Track how your links are performing across the web with <br></br>our advanced statistics dashboard</p>
                <div className="flex flex-row">
                    <div className="mx-auto bg-white w-1/4 m-12 p-4 relative">
                        <div className="absolute -top-10 bg-blue-950 p-4 rounded-full w-20 h-20">
                            <img src={image1} alt="Not found" className="mx-auto"></img>
                        </div>
                        <h2 className="pt-10 p-4 pb-0 mx-auto font-bold text-2xl">Brand Recognition</h2>
                        <p className="p-4 text-gray-400">Boost your brand recognition with each click. Generic links don't mean a thing. Branded links help instil confidence in your content.</p>
                    </div>
                    <div className="relative mx-auto bg-white w-1/4 m-12 p-4">
                        <div className="absolute -top-10 bg-blue-950 p-4 rounded-full w-20 h-20">
                            <img src={image2} alt="Not found" className="mx-auto"></img>
                        </div>
                        <h2 className="pt-10 p-4 pb-0 mx-auto font-bold text-2xl">Detailed Records</h2>
                        <p className="p-4 text-gray-400">Gain insights into who is clicking your links. Knowing when and where people engage with your content helps inform better decisions.</p>
                    </div>
                    <div className="relative mx-auto bg-white w-1/4 m-12 p-4">
                        <div className="absolute -top-10 bg-blue-950 p-4 rounded-full w-20 h-20">
                            <img src={image3} alt="Not found" className="mx-auto"></img>
                        </div>
                        <h2 className="pt-10 p-4 pb-0 mx-auto font-bold text-2xl">Fully Customizable</h2>
                        <p className="p-4 text-gray-400">Improve brand awareness and content discoverability through customizable links, supercharging audience engagement</p>
                    </div>
                </div>
            </div>
            <div className="w-full p-8 flex flex-col bg-blue-950" style={{ backgroundImage: `url(${LastImage})`, backgroundSize: 'cover', backgroundPosition: 'top left' }}>
                <h1 className="text-4xl mx-auto font-bold text-white">Boost your link today!</h1>
                <a href="#shorten-link-section" onClick={scrollToShortener} className="h-12 mt-8 mb-8 bg-teal-400 mx-auto px-4 py-3 transition ease-in-out duration-300 hover:scale-110 text-white rounded-3xl font-bold hover:bg-teal-500 dark:bg-blue-500">Get Started</a>
            </div>
            <div className="bg-black flex flex-row text-white">
                <a onClick={() => navigate("/")} className="p-20 font-bold text-4xl hover:text-teal-400 dark:hover:text-blue-500" href="/">Shortly</a>
                <div className="flex flex-col p-20 text-md text-gray-400 space-y-4">
                    <h2 className="text-white font-bold">Feature</h2>
                    <Link to="/" className="hover:text-white">Link Shortening</Link>
                    <Link to="/" className="hover:text-white">Branded Links</Link>
                    <Link to="/" className="hover:text-white">Analytics</Link>
                </div>
                <div className="flex flex-col p-20 text-md space-y-4 text-gray-400">
                    <h2 className="text-white font-bold">Resources</h2>
                    <Link to="/" className="hover:text-white">Blog</Link>
                    <Link to="/" className="hover:text-white">Developers</Link>
                    <Link to="/" className="hover:text-white">Support</Link>
                </div>
                <div className="flex flex-col p-20 space-y-4 text-md text-gray-400">
                    <h2 className="text-white font-bold">Company</h2>
                    <Link to="/" className="hover:text-white">About</Link>
                    <Link to="/" className="hover:text-white">Our Team</Link>
                    <Link to="/" className="hover:text-white">Careers</Link>
                    <Link to="/" className="hover:text-white">Contact</Link>
                </div>
                <div className="flex flex-row p-6 pt-20">
                    <Link to="/" className="p-4 pt-2 hover:scale-110 transition ease-in-out duration-300"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="20"><path fill="#FFF" d="M24 2.557a9.83 9.83 0 01-2.828.775A4.932 4.932 0 0023.337.608a9.864 9.864 0 01-3.127 1.195A4.916 4.916 0 0016.616.248c-3.179 0-5.515 2.966-4.797 6.045A13.978 13.978 0 011.671 1.149a4.93 4.93 0 001.523 6.574 4.903 4.903 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084 4.928 4.928 0 004.6 3.419A9.9 9.9 0 010 17.54a13.94 13.94 0 007.548 2.212c9.142 0 14.307-7.721 13.995-14.646A10.025 10.025 0 0024 2.557z"/></svg></Link>
                    <Link to="/" className="p-4 pt-2 hover:scale-110 transition ease-in-out duration-300"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#FFF" d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg></Link>
                    <Link to="/" className="p-4 pt-2 hover:scale-110 transition ease-in-out duration-300"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#FFF" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></Link>
                    <Link to="/" className="p-4 pt-2 hover:scale-110 transition ease-in-out duration-300"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#FFF" d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"/></svg></Link>
                </div>
            </div>
        </div>
    );
}