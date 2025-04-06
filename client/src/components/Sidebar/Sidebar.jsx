import React, { useContext, useState } from 'react';
import { IoMenuOutline } from "react-icons/io5";
import Student from './Student';
import Faculty from './Faculty';
import AcadAdmin from './AcadAdmin';
import HostelAdmin from './HostelAdmin';
import { RoleContext } from '../../context/Rolecontext';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const { role } = useContext(RoleContext);

    return (
        <>
            {!isOpen && 
                <>
                    <div className="p-2 relative">
                        <button onClick={() => setIsOpen(!isOpen)} className="bg-transparent border-none text-2xl cursor-pointer mr-2">
                            <IoMenuOutline />
                        </button>
                    </div>
                </>
            }
            {isOpen && 
                <>
                    <div className="w-[250px] relative top-0 left-0 min-h-screen bg-gray-100 border-r-2 border-gray-300 p-2 font-sans">
                        <button onClick={() => setIsOpen(!isOpen)} className="bg-transparent border-none text-2xl cursor-pointer mr-2">
                            <IoMenuOutline />
                        </button>
                    {role === "student" && <Student/>}
                    {role === "faculty" && <Faculty/>}
                    {role === "acadAdmin" && <AcadAdmin/>}
                    {role === "nonAcadAdmin" && <HostelAdmin/>}
                    </div>
                </>
            }
        </>
    );
};

export default Sidebar;