import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import "./style/dashboard.css";
import axios from 'axios';
import eNumber from "../img/eNumber.png"
import cNumber from "../img/cNumber.png"
import money from "../img/money.png"
import {Bar,Doughnut,Line} from "react-chartjs-2"
import { CategoryScale, Chart, registerables } from "chart.js";


function DashboardBox(){

    Chart.register(...registerables);
    Chart.register(CategoryScale);
    const [totalMoney,setTotalMoney] = useState([]);
    const[companyName,setCompanyNames] = useState([]);
    const[employeeNumber,setEmployeeNumber] = useState([]);
    const[leavesEmployeeID,setLeavesEmployeesID] = useState([]);
    const[leavesEmployeeName,setLeavesEmployeesName] = useState([]);
    const[advanceMoney,setAdvanceMoney] = useState([]);
    const[leavesDay,setLeavesDay] = useState([]);
    const [companies, setCompanies] = useState([]);

      useEffect(() => {
        axios.get("http://localhost:8081/getAllEmployees")
          .then(res => {
            setLeavesEmployeesID(res.data.map(item => item.userID));
          })
          .catch(err => console.log(err));
      }, [leavesEmployeeID]);

      const fetchLeavesDay = async (userID) => {
        try {
          const res = await axios.get(`http://localhost:8081/employeeLeaves/${userID}`);
          const endDate = new Date(res.data[0].bitis);
          const currentDate = new Date();
          const timeDifference = endDate - currentDate;
          const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
          return days; 
        } catch (err) {
          console.log(err);
          return null;
        }
      };
      
      
useEffect(() => {
  const fetchLeavesDaySequentially = async () => {
    const leavesInfo = [];
    for (const employeeID of leavesEmployeeID) {
      const days = await fetchLeavesDay(employeeID);
      if (days !== null) {
        leavesInfo.push(days);
      }
    }
    setLeavesDay(leavesInfo);
  };

  if (leavesEmployeeID.length > 0) {
    fetchLeavesDaySequentially();
  }
});

useEffect(() => {
  axios.get("http://localhost:8081/getAllEmployees")
    .then(res => {
      setLeavesEmployeesID(res.data.map(item => item.userID));
    })
    .catch(err => console.log(err));
}, []);      
      

      const fetchEmployeeLeaves = async (id) => {
        try {
          const res = await axios.get(`http://localhost:8081/employeeLeavesName/${id}`);
          return res.data[0].isim;
        } catch (err) {
          console.log(err);
          return null;
        }
      };
      
    
    useEffect(() => {
      const fetchLeavesNamesSequentially = async () => {
        const names = [];
        for (const employeeID of leavesEmployeeID) {
          const name = await fetchEmployeeLeaves(employeeID);
          if (name) {
            names.push(name);
          }
        }
        setLeavesEmployeesName(names);
      };
    
      if (leavesEmployeeID.length > 0) {
        fetchLeavesNamesSequentially();
      }
    }, [leavesEmployeeID]);
      
    const fetchEmployeeNumber = async (id) => {
        try {
          const res = await axios.get(`http://localhost:8081/employeeNumber/${id}`);
          setEmployeeNumber(prevState => [...prevState, res.data.count]);
        } catch (err) {
          console.log(err);
        }
      };


    const fetchAdvanceMoney = async (id) => {
        try {
          const res = await axios.get(`http://localhost:8081/advanceMoney/${id}`);
          setAdvanceMoney(prevState => [...prevState, res.data.totalAdvanceMoney]);
        } catch (err) {
          console.log(err);
        }
      };

    useEffect(() => {
        axios.get("http://localhost:8081/firmalar")
          .then(res => {
            setCompanyNames(res.data.map(company => company.firmaIsmi)); 
            setCompanies(res.data);
          })
          .catch(err => console.log(err));
      }, []);
  


    useEffect(() => {
        axios.get("http://localhost:8081/totalAdvanceMoney")
          .then(res => {
            setTotalMoney(res.data.totalMoney);
          })
          .catch(err => console.log(err));
      }, []);


    useEffect(() => {
        const fetchEmployeeNumbersSequentially = async () => {
          for (const company of companies) {
            await fetchEmployeeNumber(company.id);
          }
        };
    
        if (companies.length > 0) {
          fetchEmployeeNumbersSequentially();
        }
      }, [companies]);
    


    useEffect(() => {
        const fetchAdvanceMoneySequentially = async () => {
          for (const company of companies) {
            await fetchAdvanceMoney(company.id);
          }
        };
      
        if (companies.length > 0) {
          fetchAdvanceMoneySequentially();
        }
      }, [companies]);
      
    const state = {
        labels: companyName,
        datasets:
            [{
                type: 'bar',
                label: "Employee Numbers",
                backgroundColor: ["#B31312","#A084E8","#8BE8E5","#D5FFE4","#916DB3","#E48586","#FCBAAD","#6C3428","#BA704F","#F4D160","#F31559","#6F61C0","#071952","#4A55A2","#F5F5F5"],
                Color: "rgb(255,255,255)",
                data: employeeNumber
            }
          ]
    }

    const stateMoney = {
      labels: companyName,
      datasets:
          [{
              label: "Total Advance Money",
              backgroundColor: ["#3F2E3E","#E9B384","#1D5B79","#468B97","#EF6262","#F3AA60","#6528F7","#A076F9","#1A5D1A","#F4D160","#D71313","#6F61C0","#F11A7B","#4A55A2","#A78295"],
              Color: "rgb(255,255,255)",
              data: advanceMoney
          }]
  }



const stateLeaves = {
  labels: leavesEmployeeName,
  datasets: [
    {
      type: 'line',
      label: "Remaining Day Off",
      borderColor: "#FFFFFF", 
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      backgroundColor: ["#B31312","#A084E8","#8BE8E5","#D5FFE4","#916DB3","#E48586","#FCBAAD","#6C3428","#BA704F","#F4D160","#F31559","#6F61C0","#071952","#4A55A2","#F5F5F5"],
      Color: "rgb(255,255,255)",
      data: leavesDay,
      pointRadius: 5,
    }
  ]
};



    const options = {
        scales: {
          x: {
            color: 'white',
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
              color: 'white',
            },
          },
          y: {
            color: 'white',
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
              color: 'white',
              precision: 0, 
              suggestedMin: 0, 
              suggestedMax: Math.max(...employeeNumber), 
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: 'white',
            },
          },
        },
      };
      
      const optionsM = {
        plugins: {
          legend: {
            labels: {
              color: 'white',
            },
          },
        },
      };
        

    const[employeeCount,setEmployeeCount] = useState("");
    const[avansCount,setAvansCount] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8081/personeller")
          .then(res => {
            setEmployeeCount(res.data.length);
            let avansCount = 0;
            res.data.forEach(employee => {
              if (employee.avans > 0) {
                avansCount++;
              }
            });
            setAvansCount(avansCount);
          })
          .catch(err => console.log(err));
      }, []);
      
    const[companyCount,setCompanyCount] = useState("");
      
   
    useEffect(() => {
          axios.get("http://localhost:8081/firmalar")
            .then(res => {
              setCompanyCount(res.data.length);
            })
            .catch(err => console.log(err));
        }, []);


        const [data,setData] = useState([]);


        useEffect(() => {
          axios.get('http://localhost:8081/upload')
            .then(res => {
              setData(res.data);
            })
            .catch(err => console.log(err));
        },[data]);    
 

    return(
        <div className='d-flex flex-column vh-100'>
        <style>
            {`@import url('https://fonts.googleapis.com/css2?family=Signika+Negative:wght@500&display=swap');`}
        </style>
            <div className='box'>
            <div className='row infoBoxes'>
                <div className='col-lg-3 col-sm-12 generalBox animate__animated animate__bounceInLeft'>
                    <div className='litteBox'>
                        <div className='row'>
                            <div className='col-8 content'>
                                <div className='row content1'>Total Employee Number</div>
                                <div className='row content2'>{employeeCount} Employees</div>
                            </div>
                            <div className='col-3 photoDiv'>
                                <img src={eNumber} className='infoPhotos'></img>
                            </div>
                        </div>
                    </div>
                </div>    
                <div className='col-lg-3 col-sm-12 generalBox animate__animated animate__bounceInDown'>
                    <div className='litteBox'>
                        <div className='row'>
                            <div className='col-8 content'>
                                <div className='row content1'>Total Company Number</div>
                                <div className='row content2'>{companyCount} Company</div>
                            </div>
                            <div className='col-3 photoDiv'>
                                <img src={cNumber} className='infoPhotos'></img>
                            </div>
                        </div>
                    </div>
                </div>   
                <div className='col-lg-3 col-sm-12 generalBox animate__animated animate__bounceInRight'>
                    <div className='litteBox'>
                        <div className='row'>
                            <div className='col-8 content'>
                                <div className='row content1' >Total Advance Money</div>
                                <div className='row content2'>{avansCount} Advance</div>
                            </div>  
                            <div className='col-4 photoDiv'>
                                 <img src={money} className='infoPhotos'></img>
                            </div>
                        </div>
                    </div>
                </div>   
            </div>    
            <div className='row contentBoxes'>
                <div className='col-lg-7 col-sm-12'>
                    <div className='bigBox animate__animated animate__bounceInLeft'>
                        <Bar className='Table' data={state} options={options} />
                    </div>
                </div>
                <div className='col-lg-5 col-sm-12'>
                        <div className='mediumBox animate__animated animate__bounceInDown'>
                        <Doughnut className='circleTable' data={stateMoney} options={optionsM}/>
                        <h1 className='totalMoneyInfo'>Total Advance Money : {totalMoney} TL</h1>
                        </div>
                </div>
            </div>
            <div className='row contentBoxes'>
                <div className='col-lg-7 col-sm-12'>
                    <div className='bigBox animate__animated animate__bounceInLeft'>
                        <Line className='Table' data={stateLeaves} options={options} />
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}

export default DashboardBox;