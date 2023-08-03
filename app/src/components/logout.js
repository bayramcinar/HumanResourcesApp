import React from 'react'
import LogIN from './loginComponent';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Logout() {

  const addError = () => {
    toast.success('Log Out Successfully !', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
  }

  axios.get("http://localhost:8081/logout").then(res =>{
    setTimeout(() => {
      addError();
    }, 10);
    return res.data;
  })  
  return (
    <div>
      <LogIN/>
      <ToastContainer />
    </div>
  )
}

export default Logout;
