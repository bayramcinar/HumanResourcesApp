import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./style/addEmployee.css";
import Modal from 'react-bootstrap/Modal';
import "./style/employees.css";
import {Navigate, useNavigate } from 'react-router-dom';
import logo from "../img/company.png"
import Button from 'react-bootstrap/Button';
import Validation from './companiesValidation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import CompanyProfile from './companyProfile';

function Companies() {
  const [email,setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const[errors,setErrors] = useState({})
  const navigate = useNavigate();

  const addError = () => {
    toast.error('Company is already in table !', {
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

  const [firmaIsmi,setFirmaIsmi] = useState("");
  const [firmaTelefon,setFirmaTelefon] = useState("");
  const [firmaAdres,setFirmaAdres] = useState("");
  const [firmaEmail,setFirmaEmail] = useState("");
  const [id,setId] = useState("");

  const [show2, setShow2] = useState(false);

  const handleClose2 = () => {
       updateTable();
      setShow2(false);
    }
  const handleShow2 = (id, firmaIsmi, firmaTelefon, firmaAdres, firmaEmail) => {
    setId(id);
    setFirmaTelefon(firmaTelefon);
    setFirmaAdres(firmaAdres);
    setFirmaEmail(firmaEmail);
    setFirmaIsmi(firmaIsmi);
    setShow2(true);   
    axios.get(`http://localhost:8081/firmadetaylari/${id}`)
        .then((res) => {
          if(res.data ==="No data"){
            setFirmaEmail("No Data");
            setFirmaTelefon("No Data");
            setFirmaAdres("No Data");
          }else{
            updateTable();
            setFirmaIsmi(companyName.find(company => company.id === res.data[0].id)?.firmaIsmi)
            setFirmaEmail(res.data[0].firmaEmail);
            setFirmaTelefon(res.data[0].firmaTelefon);
            setFirmaAdres(res.data[0].firmaAdres);
            setCompanieDetails(res.data);
          }

        })
        .catch((err) => console.log(err));
    axios.get("http://localhost:8081/firmalar")
      .then(res => {
        setCompanies(res.data);
      })
      .catch(err => console.log(err));

    axios.get("http://localhost:8081/firmalar")
      .then(res => {
        setCompanyNames(res.data);
      })
      .catch(err => console.log(err));      
  };

  const searchButtonStyle = {
    right: isAdmin ? '60px' : '12px',
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
        navigate("/login");
      }
    })
    .catch(err => console.log(err))
  },[])

  const [show1, setShow1] = useState(false);

  const handleClose1 = () => {
    const err = Validation(values);
    setErrors(err);
    err.firmaIsmi ="";
    setShow1(false);
  }
  const handleShow1 = () => setShow1(true);

  const [values, setValues] = useState({
    firmaIsmi: ''
  });
  
 
  const handleInput = (event) =>{
    setValues(prev => ({...prev, [event.target.name]: [event.target.value.toUpperCase()]}))
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    const err = Validation(values);
    setErrors(err);
    setShow1(true);
    if(err.firmaIsmi === ""){
      axios
        .post('http://localhost:8081/firmalar', values)
        .then((res) => {
          console.log(res.data.error);
          if(res.data.error==="companyError"){
            addError();
            setShow1(true);
          }else{
            axios.get("http://localhost:8081/firmalar")
            .then(res => {
              setCompanies(res.data);
              addSuccess();
              setShow1(false);
            })
            .catch(err => console.log(err));
          }
        })
        .catch((err) => console.log(err));
    }
  };
  
  const addSuccess = () => {
    toast.success('Company added successfully !', {
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

  const deleteSuccess = () => {
        toast.success('Company deleted successfully !', {
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
  const deleteError = () => {
        toast.error('Company Could not delete. Firstly, Please delete the employees who work in this company !', {
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
    


  const deleteCompany = (id) =>{
    axios.delete(`http://localhost:8081/firmadetaylari/${id}`)
        .then((res) => {
          if(res.data.message ==="company error"){
          }else{
          }
          updateTable(); 
        })
        .catch((err) => console.log(err));    
    axios.delete(`http://localhost:8081/firmalar/${id}`)
        .then((res) => {
          if(res.data.message ==="company error"){
            deleteError();
          }else{
            deleteSuccess(); 
          }
          updateTable(); 
        })
        .catch((err) => console.log(err));
    
       
}

const[companyName,setCompanyNames] = useState([]);

const updateTable = () => {
  Promise.all([
    axios.get("http://localhost:8081/firmalar"),
    axios.get("http://localhost:8081/firmadetaylari")
  ])
    .then(([personellerRes, personelDetaylariRes]) => {
      setCompanies(personellerRes.data);
      setCompanieDetails(personelDetaylariRes.data);
    })
    .catch(err => console.log(err));
};

  const [companies, setCompanies] = useState([]);
  const [companieDetails, setCompanieDetails] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8081/firmalar")
      .then(res => {
        setCompanies(res.data);
      })
      .catch(err => console.log(err));

    axios.get("http://localhost:8081/firmalar")
      .then(res => {
        setCompanyNames(res.data);
      })
      .catch(err => console.log(err));  
  }, []);

  const [search,setSearch] = useState("");
  const [openSearch,setOpenSearch] = useState(false);

  const searchFunction = () =>{
    if(openSearch===true){
      setOpenSearch(false)
    }else{
      setOpenSearch(true)
    }
  }

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:8081/firmadetaylari/${id}`)
        .then((res) => {
          if(res.data ==="No data"){
            setFirmaEmail("No Data");
            setFirmaTelefon("No Data");
            setFirmaAdres("No Data");
          }else{
            updateTable();
            setFirmaIsmi(companyName.find(company => company.id === res.data[0].id)?.firmaIsmi)
            setFirmaEmail(res.data[0].firmaEmail);
            setFirmaTelefon(res.data[0].firmaTelefon);
            setFirmaAdres(res.data[0].firmaAdres);
            setCompanieDetails(res.data);
          }

        })
        .catch((err) => console.log(err));
        updateTable(); 
    }
  }, [id]); 

  return (
    <div className='app'>
        <main class="table">
          <section className='table_body' >
          {openSearch && (
            <Form className='searchInputArea animate__animated animate__flipInX'>
              <InputGroup>
                <Form.Control onChange={(e) => setSearch(e.target.value)} placeholder='Search Company...'/>
              </InputGroup>
            </Form>
            )}
              <table>
              <thead id='tableHeader'>
                      <tr>
                          <th className='animate__animated animate__bounceInDown' >#</th>
                          <th className='animate__animated animate__bounceInDown'>Photo</th>
                          <th className='animate__animated animate__bounceInDown'>Company Name
                          </th >
                          <th className='animate__animated animate__bounceInDown'>Options</th>
                      </tr>
                      {isAdmin && (
                        <Button variant="primary" className='addbtn' onClick={handleShow1} >
                          <i class="fa-solid fa-plus"></i>
                          </Button>
                      )}
                      <Button variant="warning" style={searchButtonStyle} className='searchbtn' onClick={searchFunction} >
                          <i class="fa-solid fa-magnifying-glass"></i>
                          </Button>
                    </thead> 
                <tbody>
                  {companies.filter((companie) => {
                    return search.toLowerCase() === "" ? companie : companie.firmaIsmi.toLowerCase().includes(search)
                  }).map((companie, index) => (
                    <tr key={index}>
                      <th className='animate__animated animate__fadeInTopLeft'>{index+1}</th>
                      <td>
                      <img className='animate__animated animate__flipInY' src={logo} />
                      </td>
                      <td>
                        <div>
                          <div className='nameArea animate__animated animate__fadeInTopRight'>
                            <h1 className='name'>
                              {companie.firmaIsmi}
                            </h1>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className='btn infoArea animate__animated animate__flipInX' onClick={() => handleShow2(companie.id, companie.firmaIsmi, firmaTelefon, firmaEmail, firmaAdres)}>
                            <i class="fa-solid fa-circle-info"></i>
                          </div>
                        {isAdmin===true &&
                          <div className='btn deleteArea animate__animated animate__flipInX' onClick={() => deleteCompany(companie.id)}>
                          <i class="fa-solid fa-trash"></i>
                          </div>     
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </section>
        </main>
        {show2 && (
          <CompanyProfile
            id={id}
            show2={show2}
            handleClose2={handleClose2}
            firmaIsmi={firmaIsmi}
            firmaTelefon={firmaTelefon}
            firmaAdres={firmaAdres}
            firmaEmail={firmaEmail}
          />
        )}
        <>
              <Modal className='modal1' show={show1} onHide={handleClose1}>
                <Modal.Body>
                  <div className="addEmployeeScreen">
                    <div className='eTitle'>
                         <h1 className=" title"><strong>ADD COMPANY</strong></h1>
                    </div>
                    <form action="" onSubmit={handleSubmit}>
                      <div className="row SignUpNameArea areas">
                        <label htmlFor='isim' className="SignUpNameLabel col-4 companyLabelBox"><h3 className="SignUpNameLabelText companyLabel">Company Name: </h3></label>
                        <input  autoComplete="off" type='text' placeholder='Company Name...' name='firmaIsmi' onChange={handleInput} className="SignUpNameInput form-control col-8"></input>
                        {errors.firmaIsmi && <span className='text-danger text-center'>{errors.firmaIsmi}</span>}
                      </div>
                      <div className="row buttonArea2 areas">
                        <button type='submit' className="btn signUpButton2" onClick={handleClose1}>ADD</button>
                      </div>
                    </form>
                  </div>
                </Modal.Body>
              </Modal>
        </>
      </div>
  );
}

export default Companies;
