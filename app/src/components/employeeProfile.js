import React, { useEffect, useState } from 'react';
import "./style/employeeProfile.css";
import 'bootstrap/dist/css/bootstrap.css';
import Modal from 'react-bootstrap/Modal';
import logo from "../img/profile.png"
import logoW from "../img/profileW.png"
import axios from 'axios';
import Option from './option';
import { ToastContainer, toast } from 'react-toastify';
import Validation from './addEmployeeValidation';
import {Link, Navigate, useNavigate } from 'react-router-dom';
import ValidationD from './detailsValidation';

function EmployeeProfile({id, show2, handleClose2, isim, yaş, firmaIsmi, avans, gender, telefon, github, linkedIn, hakkımda}) {

  const editSuccess = () => {
        toast.success('User edited successfully !', {
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
  const [isMale, setIsMale] = useState(false);
  useEffect(() => {
    setIsMale(gender === "MALE");
  });
  const [editedFirmaIsmi, setEditedFirmaIsmi] = useState(firmaIsmi);
  const [editedisim, setEditedisim] = useState(isim);
  const [editedyaş, setEditedyaş] = useState(yaş);
  const [editedavans, setEditedavans] = useState(avans);

  const [editedtelefon, setEditedTelefon] = useState(telefon);
  const [editedgithub, setEditedGithub] = useState(github);
  const [editedlinkedIn, setEditedLinkedIn] = useState(linkedIn);
  const [editedhakkımda, setEditedHakkımda] = useState(hakkımda);


  const handleEditClick = () => {
    setEdit(!edit);
    setEditedGithub(github);
    setEditedHakkımda(hakkımda);
    setEditedLinkedIn(linkedIn);
    setEditedTelefon(telefon);
    setEditedFirmaIsmi(companyName.find(company => company.firmaIsmi === firmaIsmi).id);
  };
  
  const handlePhoneChange = (event) => {
    setEditedTelefon(event.target.value);
  };

  const handleGithubChange = (event) => {
    setEditedGithub(event.target.value);
  };

  const handleLinkedInChange = (event) => {
    setEditedLinkedIn(event.target.value);
  };

  const handleHakkımdaChange = (event) => {
    setEditedHakkımda(event.target.value);
  };

  const handleFirmaIsmiChange = (event) => {
    setEditedFirmaIsmi(event.target.value);
  };

  const handleIsimChange = (event) => {
    setEditedisim(event.target.value);
  };

  const handleYaşChange = (event) => {
    setEditedyaş(event.target.value);
  };

  const handleAvansChange = (event) => {
    setEditedavans(event.target.value);
  };

  axios.defaults.withCredentials=true;
  useEffect(()=>{
    axios.get("http://localhost:8081/employees")
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

  const[errorsD,setErrorsD] = useState({})

  const [values, setValues] = useState({
    isim: isim,
    yaş: yaş,
    firmaID: firmaIsmi,
    avans: avans,
    gender: gender,
    id: id,
  });

  useEffect(() => {
    setValues({
      isim: editedisim,
      yaş: editedyaş,
      firmaID: editedFirmaIsmi,
      avans: editedavans,
      gender: gender,
      id: id,
    });
  }, [editedisim, editedyaş, editedFirmaIsmi, editedavans,gender, id]);

  const [values1, setValues1] = useState({
    telefon: telefon,
    github: github,
    linkedIn: linkedIn,
    hakkımda: hakkımda
  });

  useEffect(() => {
    setValues1({
      telefon: editedtelefon,
      github: editedgithub,
      linkedIn: editedlinkedIn,
      hakkımda: editedhakkımda
    });
  }, [editedtelefon, editedgithub, editedlinkedIn, editedhakkımda]);

  const[companyName,setCompanyNames] = useState([]);
  
  const [employees, setEmployees] = useState([]);

  const [employeeDetails, setEmployeeDetails] = useState([]);


  const updateTable = () => {
    Promise.all([
      axios.get("http://localhost:8081/personeller"),
      axios.get("http://localhost:8081/personeldetaylari")
    ])
      .then(([personellerRes, personelDetaylariRes]) => {
        setEmployees(personellerRes.data);
        setEmployeeDetails(personelDetaylariRes.data);
      })
      .catch(err => console.log(err));
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    const err = Validation(values);
    setErrors(err);
    const updatedValues1 = { ...values1, id: values.id };
    const errD = ValidationD(updatedValues1);
    setErrorsD(errD);
    if (err.avans === "" && err.isim === "" && err.yaş === "" && err.firmaID === "" && err.firmaID === "" && err.gender === "") {
      axios.post('http://localhost:8081/personeller', values)
        .then(res => {
          console.log(res.data);
          updateTable();
        })
        .catch(err => console.log(err));
    }
    if (!(errD.editedtelefon === "" && errD.editedgithub === "" && errD.editedlinkedIn === "" && errD.editedhakkımda === "")){
          axios.post("http://localhost:8081/personeldetaylari", updatedValues1)
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
  
  
  const [data,setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8081/personeller")
      .then(res => {
        setEmployees(res.data);
      })
      .catch(err => console.log(err));  
    
    axios.get("http://localhost:8081/firmalar")
      .then(res => {
        setCompanyNames(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    axios.get(`http://localhost:8081/upload/${id}`)
      .then(res => {
        setData(res.data[0]);
      })
      .catch(err => console.log(err));
  });

  useEffect(() => {
    axios.get("http://localhost:8081/personeldetaylari")
      .then(res => {
        setEmployeeDetails(res.data[0]);
      })
      .catch(err => console.log(err));
  });



    const [file,setFile] = useState();

    const handleFile = (e) =>{
      setFile(e.target.files[0]);
    }

    const handleUpload = () =>{
      const formdata = new FormData();
      formdata.append("img",file);
      formdata.append("id", id);
      console.log(formdata);
      axios.post("http://localhost:8081/upload",formdata)
      .then(res => {
        if(res.data.Status === "success"){
          console.log("succeded");
        }else{
          console.log("failed");
        }
      })
      .catch(err => console.log(err));
    }

  return (
    <>
      <Modal className='modalProfile' show={show2} onHide={handleClose2} >
        <Modal.Body>
          <div>
            <div className='boxProfile row'>
              <div className='col-sm-8 col-md-6'>
              <div className='profilePhotoArea row animate__animated animate__zoomIn'>
                {data.image === null && (
                  isMale ? (
                    <img className='profileImg' src={logo} alt="Profile" />
                  ) : (
                    <img className='profileImg' src={logoW} alt="Profile" />
                  )
                )}
                {data.image !== null && (
                  <div>
                    <img className='realProfile' src={`http://localhost:8081/img/` + data.image} style={{ width: "50px" }} />
                  </div>
                )}
                {edit === true && (
                  <div>
                    <input type='file' onChange={handleFile} className="form-control photoInput animate__animated animate__zoomIn" />
                  </div>
                )}
              </div>

                <form action="" onSubmit={handleSubmit}>
                  <div className='profileNameArea row '>
                    <h1 className='profileTitle col-4'>Name :</h1>
                    {edit === false && <h1 className='profileName col-6 animate__animated animate__fadeInLeft'>{isim}</h1>}
                    {edit === true && <input autoComplete="off" type='text' value={editedisim} name='editisim' className="editNameInput form-control col-6 animate__animated animate__fadeInLeft" onChange={handleIsimChange}></input>}
                    {errors.isim && <span className='text-danger text-center'>{errors.isim}</span>}
                  </div>
                  <div className='profileAgeArea row'>
                    <h1 className='profileTitle col-4'>Age :</h1>
                    {edit === false && <h1 className='profileAge col-6 animate__animated animate__fadeInLeft'>{yaş}</h1>}
                    {edit === true && <input autoComplete="off" type='text' value={editedyaş} name='edityaş' className="editAgeInput form-control col-6 animate__animated animate__fadeInLeft" onChange={handleYaşChange}></input>}
                    {errors.yaş && <span className='text-danger text-center'>{errors.yaş}</span>}
                  </div>
                  <div className='profileCompanyArea row'>
                    <h1 className='profileTitle col-4'>Company :</h1>
                    {edit === false && <h1 className='profileCompany col-7 animate__animated animate__fadeInLeft'>{firmaIsmi}</h1>}
                    {edit === true && 
                    
                    <select  onclick="this.size=5;" onblur='this.size=1;' onchange='this.size=1; this.blur();' class="form-select editCompanyInput animate__animated animate__fadeInLeft" aria-label="Default select example" name='editfirmaIsmi'  onChange={handleFirmaIsmiChange}>
                      <option value="" selected hidden>{firmaIsmi}</option>
                            {companyName.map(company => (
                              <Option id={company.id} name={company.firmaIsmi}/>
                            ))}
                      </select>
                    }
                    {errors.firmaID && <span className='text-danger text-center'>{errors.firmaID}</span>}
                  </div>  
                  <div className='profileAvansArea row'>
                    <h1 className='profileTitle col-4'>Advance :</h1>
                    {edit === false && <h1 className='profileAvans col-6 animate__animated animate__fadeInLeft'>{avans} TL</h1>}
                    {edit === true && <input autoComplete="off" type='text' value={editedavans} name='editavans' className="editAvansInput form-control col-6 animate__animated animate__fadeInLeft" onChange={handleAvansChange}></input>}
                    {errors.avans && <span className='text-danger text-center'>{errors.avans}</span>}
                  </div>
                  <div className='profilePhoneArea row'>
                    <h1 className='profileTitle col-4'>Phone :</h1>
                    {edit === false && <h1 className='profilePhone col-6 animate__animated animate__fadeInLeft'>{telefon}</h1>}
                    {edit === true && <input autoComplete="off" type='text' value={editedtelefon} name='editphone' className="editPhoneInput form-control col-6 animate__animated animate__fadeInLeft" onChange={handlePhoneChange}></input>}
                    {errorsD.editedtelefon && <span className='text-danger text-center'>{errorsD.editedtelefon}</span>}
                  </div>
                  <div className='profileGithubArea row'>
                    <h1 className='profileTitle col-4'>Github :</h1>
                    {edit === false && github!=="No Data" && linkedIn!=="No Data" &&
                      <h1 className='profileGithub col-8 animate__animated animate__fadeInLeft'>
                        <i class="fa-brands fa-github"></i>
                        <Link target="_blank" className='linkGithub' to={`https://github.com/${github}`}>{github}</Link>
                      </h1>                  
                    }
                    {edit === false && github==="No Data" && linkedIn==="No Data" &&
                    <h1 className='profileGithub col-6 animate__animated animate__fadeInLeft'>
                      {github}
                    </h1>   
                    }
                    {edit === true && <input autoComplete="off" type='text' value={editedgithub} name='editgithub' className="editGithubInput form-control col-6 animate__animated animate__fadeInLeft" onChange={handleGithubChange}></input>}
                    {errorsD.editedgithub && <span className='text-danger text-center'>{errorsD.editedgithub}</span>}
                  </div>
                  <div className='profileLinkedInArea row'>
                    <h1 className='profileTitle col-4'>LinkedIn :</h1>
                    {edit === false && github!=="No Data" && linkedIn!=="No Data" &&
                    <h1 className='profileLinkedIn col-8 animate__animated animate__fadeInLeft'>
                      <i class="fa-brands fa-linkedin"></i>
                      <Link target="_blank" className='linkLinkedIn' to={`https://www.linkedin.com/in/${linkedIn}`}>{linkedIn}</Link>
                    </h1>   
                    }
                    {edit === false && github==="No Data" && linkedIn==="No Data" &&
                    <h1 className='profileLinkedIn col-6 animate__animated animate__fadeInLeft'>
                      {linkedIn}
                    </h1>   
                    }
                    {edit === true && <input autoComplete="off" type='text' value={editedlinkedIn} name='editlinkedIn' className="editLinkedInInput form-control col-6 animate__animated animate__fadeInLeft" onChange={handleLinkedInChange}></input>}
                    {errorsD.editedlinkedIn && <span className='text-danger text-center'>{errorsD.editedlinkedIn}</span>}
                  </div>
                  <div className='editSaveBtnArea row animate__animated animate__fadeInUp'>
                    {edit === true && 
                    <button type='submit' className='btn btn-warning editSaveBtn' onClick={handleUpload} onSubmit={handleSubmit}>SAVE</button>
                    }
                  </div>
                </form>
              </div>
              <div className='col-sm-8 col-md-6 hakkımdaDiv'>
                <h1 className='titleInfo'>About Me</h1>
                {edit === false &&  <p className='infoText animate__animated animate__fadeInRight'>{hakkımda}</p>}
                    {edit === true && <textarea rows="23" cols="50" autoComplete="off" type='text-area' value={editedhakkımda} name='edithakkımda' className="editHakkımdaInput form-control col-6 animate__animated animate__fadeInRight" onChange={handleHakkımdaChange}></textarea>}
                    {errorsD.editedhakkımda && <span className='text-danger text-center'>{errorsD.editedhakkımda}</span>}
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

export default EmployeeProfile;
