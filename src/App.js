import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import MyAccount from "./pages/MyAccount";
import ForgotPass from "./pages/ForgotPass";
import { auth, database, ref, get } from "./firebase";
import Swal from 'sweetalert2';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true); // Add a loading state
  const navigate = useNavigate();

  const logIn = (data) => {
    setLoggedIn(true);
    setUserData(data);
    Cookies.set('loggedIn', true, { expires: 90 }); 
    navigate("/");
  };
  
  const logOut = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Log Out!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await auth.signOut();
        setLoggedIn(false);
        Cookies.remove('loggedIn'); 
        setUserData({});
        navigate("/");
        Swal.fire({
          title: "Logged Out!",
          text: "You have been logged out.",
          icon: "success"
        });
      }
    });
  };

  useEffect(() => {
    const fetchUrls = async (userId) => {
      try {
        const dbRef = ref(database, `users/${userId}/shortenedUrls`);
        const snapshot = await get(dbRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const urls = Object.values(data);
          console.log("User Data: ", urls);
          setUserData(urls);
        } else {
          console.log("No data available for this user");
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoading(false); // Firebase auth state is now known
      if (user) {
        // console.log(user);
        setLoggedIn(true);
        setUserName(user.displayName);
        Cookies.set('loggedIn', true, { expires: 90 });
        fetchUrls(user.uid); // Fetch user data once user is authenticated
      } else {
        setLoggedIn(false);
        Cookies.remove('loggedIn');
        setUserData({});
        console.log("User is not logged in");
      }
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }, []);
  

  return (
    <div className="App">
      <NavBar loggedIn={loggedIn} logOut={logOut} userName={userName}/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login login={logIn}/>} />
        <Route path="/signup" element={<SignUp login={logIn}/>} />
        <Route path="/account" element={<MyAccount urlsData={userData} loading={loading}/>} />
        <Route path="/forgotPass" element={<ForgotPass />} />
      </Routes>
    </div>
  );
}

export default App;