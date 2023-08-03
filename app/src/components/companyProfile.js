import React, { useEffect, useState } from 'react';
import "./style/employeeProfile.css";
import "./style/companyProfile.css";
import 'bootstrap/dist/css/bootstrap.css';
import Modal from 'react-bootstrap/Modal';
import logo from "../img/company.png"
import axios from 'axios';
import Option from './option';
import { ToastContainer, toast } from 'react-toastify';
import Validation from './companiesValidation';
import {Link, Navigate, useNavigate } from 'react-router-dom';
import ValidationD from './detailsValidation';

function CompanyProfile({id, show2, handleClose2, firmaIsmi, firmaTelefon, firmaAdres, firmaEmail}) {

  const editSuccess = () => {
        toast.success('Company edited successfully !', {
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
    const [email,setEmail] = useState("");
   const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editedFirmaIsmi, setEditedFirmaIsmi] = useState(firmaIsmi);
  const [editedFirmaTelefon, setEditedFirmaTelefon] = useState(firmaTelefon);
  const [editedFirmaAdres, setEditedFirmaAdres] = useState(firmaAdres);
  const [editedFirmaEmail, setEditedFirmaEmail] = useState(firmaEmail);



  const handleEditClick = () => {
    setEdit(!edit);
    setEditedFirmaIsmi(firmaIsmi);
    setEditedFirmaTelefon(firmaTelefon);
    setEditedFirmaAdres(firmaAdres);
    setEditedFirmaEmail(firmaEmail);
  };
  
  const handleFirmaNameChange = (event) => {
    setEditedFirmaIsmi(event.target.value);
  };

  const handleFirmaTelefonChange = (event) => {
    setEditedFirmaTelefon(event.target.value);
  };

  const handleFirmaEmailChange = (event) => {
    setEditedFirmaEmail(event.target.value);
  };

  const handleFirmaAdresChange = (event) => {
    setEditedFirmaAdres(event.target.value);
  };

  axios.defaults.withCredentials=true;
  useEffect(()=>{
    axios.get("http://localhost:8081/companies")
    .then(res => {
      if(res.data.valid){
        if(res.data.rol==="admin"){
          setIsAdmin(true);
        }
        setEmail(res.data.email);
      }else{
        console.log(res.data);
        navigate("/login");
      }
    })
    .catch(err => console.log(err))
  },[])

  const[errors,setErrors] = useState({})

  const[errorsN,setErrorsN] = useState({})

  const[errorsD,setErrorsD] = useState({})

  const [values, setValues] = useState({
    firmaTelefon: firmaTelefon,
    firmaEmail: firmaEmail,
    firmaAdres: firmaAdres,
    id: id,
  });

  useEffect(() => {
    setValues({
      firmaTelefon: editedFirmaTelefon,
      firmaEmail: editedFirmaEmail,
      firmaAdres: editedFirmaAdres,
      id: id,
    });
  }, [editedFirmaTelefon, editedFirmaEmail, editedFirmaAdres, id]);

  const [valuesN, setValuesN] = useState({
    firmaIsmi: firmaIsmi,
    id: id,
  });

  useEffect(() => {
    setValuesN({
      firmaIsmi: editedFirmaIsmi,
      id: id,
    });
  }, [editedFirmaIsmi, id]);


  const [companies, setCompanies] = useState([]);

  const [companyDetails, setCompanyDetails] = useState([]);


  const updateTable = () => {
    Promise.all([
      axios.get("http://localhost:8081/firmalar"),
      axios.get("http://localhost:8081/firmadetaylari")
    ])
      .then(([firmalarRes, firmaDetaylariRes]) => {
        setCompanies(firmalarRes.data);
        setCompanyDetails(firmaDetaylariRes.data);
      })
      .catch(err => console.log(err));
  };


  const handleSubmit = (event) => {
    const editedFirmaIsmiUpperCase = editedFirmaIsmi.toUpperCase();
    event.preventDefault();
    const err = Validation(values);
    setErrors(err);

    const errN = Validation(valuesN);
    setErrorsN(errN);

    if ((errN.firmaIsmi === "")) {
      axios.post('http://localhost:8081/firmalar', { ...valuesN, firmaIsmi: editedFirmaIsmiUpperCase })
        .then(res => {
          console.log(res.data);
          updateTable();
        })
        .catch(err => console.log(err));
    }

    if ((err.firmaTelefon === "" && err.firmaEmail === "" && err.firmaAdres === "")){
          axios.post("http://localhost:8081/firmadetaylari", values)
          .then(res => {
            console.log(res.data);
            updateTable();
          })
          .catch(err => console.log(err)); 
    }
 
    handleClose2();
    editSuccess();
    updateTable();
}
  
  

  useEffect(() => {
    axios.get("http://localhost:8081/firmalar")
      .then(res => {
      })
      .catch(err => console.log(err));
    axios.get("http://localhost:8081/firmadetaylari")
      .then(res => {
      })
      .catch(err => console.log(err));
  });

  
  return (
    <>
      <Modal className='modalProfile' id="companyModal" show={show2} onHide={handleClose2} >
        <Modal.Body>
          <div>
            <div className='boxProfile row'>
              <div className='col-sm-8 col-md-6'>
                <div className='profilePhotoArea row animate__animated animate__zoomIn'>
                  <img className='profileImg' id='companyImg' src={logo} alt="Profile"></img>
                </div>
                <form action="" onSubmit={handleSubmit}>
                  <div className='profileNameArea row'>
                    <h1 className='profileTitle col-4'>Name :</h1>
                    {edit === false && <h1 className='profileName col-8 animate__animated animate__fadeInLeft'>{firmaIsmi}</h1>}
                    {edit === true && <input autoComplete="off" type='text' value={editedFirmaIsmi} name='editisim' className="editNameInput form-control col-6 animate__animated animate__fadeInLeft" onChange={handleFirmaNameChange}></input>}
                    {errors.isim && <span className='text-danger text-center'>{errors.isim}</span>}
                  </div>
                  <div className='profilePhoneArea row'>
                    <h1 className='profileTitle col-4'>Phone :</h1>
                    {edit === false && <h1 className='profileAge col-6 animate__animated animate__fadeInLeft'>{firmaTelefon}</h1>}
                    {edit === true && <input autoComplete="off" type='text' value={editedFirmaTelefon} name='edityaş' className="editAgeInput form-control col-6 animate__animated animate__fadeInLeft" onChange={handleFirmaTelefonChange}></input>}
                    {errors.yaş && <span className='text-danger text-center'>{errors.yaş}</span>}
                  </div>  
                  <div className='profileEmailArea row'>
                    <h1 className='profileTitle col-4'>E-mail :</h1>
                    {edit === false && <h1 className='profileAvans col-6 animate__animated animate__fadeInLeft' id='companyEmailText'>{firmaEmail}</h1>}
                    {edit === true && <input autoComplete="off" type='text' value={editedFirmaEmail} name='editavans' className="editAvansInput form-control col-6 animate__animated animate__fadeInLeft" onChange={handleFirmaEmailChange}></input>}
                    {errors.avans && <span className='text-danger text-center'>{errors.avans}</span>}
                  </div>
                  <div className='editSaveBtnArea row'>
                    {edit === true && 
                    <button type='submit' className='btn btn-warning editSaveBtn animate__animated animate__fadeInUp' onSubmit={handleSubmit}>SAVE</button>
                    }
                  </div>
                </form>
              </div>
              <div className='col-sm-8 col-md-6 hakkımdaDiv'>
                <h1 className='titleInfo'>Address</h1>
                {edit === false &&  <p className='infoText animate__animated animate__fadeInRight'>{firmaAdres}</p>}
                    {edit === true && <textarea rows="12" cols="50" autoComplete="off" type='text-area' value={editedFirmaAdres} name='edithakkımda' className="editHakkımdaInput form-control col-6 animate__animated animate__fadeInRight" onChange={handleFirmaAdresChange}></textarea>}
                    {errorsD.hakkımda && <span className='text-danger text-center'>{errorsD.hakkımda}</span>}
              </div>
            </div>
          </div>
          {isAdmin===true &&
            <button type='submit' className="btn editBtn" onClick={handleEditClick}><i className="fa-solid fa-pen-to-square"></i></button>
          }
        </Modal.Body>
      </Modal>
    </>
    
  )
}

export default CompanyProfile;
