import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlane } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import iitglogo from '../assets/iitglogo.jpg';
// import newRequest from '../utils/newRequest';
import axios from 'axios';

const Navbar = () => {

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // await newRequest.post("/auth/logout");

            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/logout`, {}, { withCredentials: true });
            localStorage.setItem("currentUser", null);

            if (response.status === 200) {
                console.log("Logout successful");
                navigate("/login");
            }

        } catch (err) {
            console.log(err);
        }
    }

    return (
            <nav className="bg-white py-4 shadow-lg">
                <div className="container mx-auto flex items-center justify-between px-8">
                    {/* Logo + Title */}
                    <div className="flex items-center space-x-4">
                        <img src={iitglogo} alt="Logo" className="h-12 w-12 object-contain" />
                        <h1 className="text-2xl font-bold text-gray-700 tracking-wide">Institute Automation</h1>
                    </div>

                    {/* Logout Button */}
                    <div className="flex items-center space-x-4">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="bg-gradient-to-r from-green-400 to-green-600 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
    


    );
};

export default Navbar;