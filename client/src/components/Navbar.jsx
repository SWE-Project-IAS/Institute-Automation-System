import React, { useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane } from '@fortawesome/free-solid-svg-icons';
import { Link, Navigate } from 'react-router-dom';
import iitglogo from '../assets/iitglogo.jpg';
import newRequest from '../utils/newRequest';

const Navbar = () => {
    const handleLogout = async () => {
        try {
            await newRequest.post("/auth/logout");
            localStorage.setItem("currentUser",null);
            Navigate("/");
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <nav className="bg-gray-100 py-1 shadow">
                <div className="container mx-auto flex items-center justify-between pe-5">
                    <img src={iitglogo} alt="Logo" className="h-[90px] inline-block align-text-top" />
                    <h2 className="text-xl font-semibold">Institute Automation</h2>
                    <button 
                        type="button" 
                        onClick={handleLogout}
                        className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-4 py-2 rounded-md transition duration-200"
                        >
                        Logout
                    </button>
                </div>
            </nav>
        </>

    );
};

export default Navbar;