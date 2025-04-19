import axios from "axios";

const newRequest=axios.create({
    // baseURL:"https://ias-server-cpoh.onrender.com/api/",
    baseURL:"http://localhost:8000/api/",
    withCredentials:true,
});

export default newRequest;