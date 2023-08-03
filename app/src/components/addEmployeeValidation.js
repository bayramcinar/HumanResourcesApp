function Validation(values){
    let error ={}

    if(values.isim ===""){
        error.isim = "Name area should not be empty !"
    }
    else{
        error.isim =""
    }
    if(values.gender ===""){
        error.gender = "Gender area should not be empty !"
    }
    else{
        error.gender =""
    }
    if(values.yaş ===""){
        error.yaş = "Age area should not be empty !"
    }else if(values.yaş > 100){
        error.yaş = "Invalid Age !"
    }
    else{
        error.yaş =""
    }
    if(values.firmaID ===""){
        error.firmaID = "Company area should not be empty !"
    }
    else{
        error.firmaID =""
    }
    if(values.avans ===""){
        error.avans = "Advance area should not be empty !"
    }
    else{
        error.avans =""
    }
    return error;
}

export default Validation;