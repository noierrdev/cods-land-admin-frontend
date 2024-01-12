import React from "react";
import { useNavigate } from "react-router-dom";
import {useSelector} from 'react-redux'
import axios from "axios";
import { BACKEND_URL } from "../AppConfigs";

const useAuth=async ()=>{
    const navigate=useNavigate();
    const token=sessionStorage.getItem('token');
    if(!token) return navigate('/')
    
}
export default useAuth;