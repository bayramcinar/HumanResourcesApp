import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import "./style/dashboard.css";
import DashboardBox from './dashboardBox';
import axios from 'axios';
import {useNavigate } from 'react-router-dom';
import Navbar from "./Navbar"

function DashboardPanel(){
  const [email,setEmail] = useState("");

  axios.defaults.withCredentials=true;

  const navigate = useNavigate();
  useEffect(()=>{
    axios.get("http://localhost:8081")
    .then(res => {
      if(res.data.valid){
        setEmail(res.data.email);
      }else{
        navigate("/login");
      }
    })
    .catch(err => console.log(err))
  },[])
  return (<div className="App">
        {<Navbar/>}
        {<DashboardBox/>}
    </div>
  )       
}

export default DashboardPanel;


