function Validation(values){
    let error ={}

    if(values.firmaIsmi ===""){
        error.firmaIsmi = "Company Name area should not be empty !"
    }
    else{
        error.firmaIsmi =""
    }
    if(values.firmaTelefon ===""){
        error.firmaTelefon = "Company Phone area should not be empty !"
    }
    else{
        error.firmaTelefon =""
    }

    if(values.firmaEmail ===""){
        error.firmaEmail = "Company E-mail area should not be empty !"
    }
    else{
        error.firmaEmail =""
    }
    if(values.firmaAdres ===""){
        error.firmaAdres = "Company Address area should not be empty !"
    }
    else{
        error.firmaAdres =""
    }


    return error;
}

export default Validation;