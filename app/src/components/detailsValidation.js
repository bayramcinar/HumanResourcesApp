function ValidationD(values){
    let error ={}
    const numericPattern = /^[0-9]{11}$/;



    if(values.editedtelefon ===""){
        error.editedtelefon = "Phone area should not be empty !"
    }else if (!numericPattern.test(values.editedtelefon)) {
        error.editedtelefon = "Please Enter a Valid Phone Number !"
    }
    else{
        error.editedtelefon =""
    }
    if(values.editedgithub ===""){
        error.editedgithub = "Github area should not be empty !"
    }
    else{
        error.editedgithub =""
    }
    if(values.editedlinkedIn ===""){
        error.editedlinkedIn = "LinkedIn area should not be empty !"
    }
    else{
        error.editedlinkedIn =""
    }
    if(values.editedhakkımda ===""){
        error.editedhakkımda = "About me area should not be empty !"
    }
    else{
        error.editedhakkımda =""
    }
    return error;
}

export default ValidationD;