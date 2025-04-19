import axios from "axios";

const newRequest=axios.create({
    baseURL:"https://ias-server-cpoh.onrender.com/api/",
    withCredentials:true,
});

export default newRequest;