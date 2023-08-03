const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const session = require('express-session');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin:["http://localhost:3000"],
  methods: ["POST","GET","DELETE"],
  credentials: true
}));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret : 'secret',
  resave: false,
  saveUninitialized: false,
  cookie:{
    secure: false,
    maxAge: 1000*60*60*24
  }
}));

const storage = multer.diskStorage({
  destination:(req,file,cb) => {
    cb(null,'public/img');
  },
  filename: (req,file,cb) =>{
    cb(null,file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  }
})

const upload = multer({
  storage: storage
})

app.post("/upload", upload.single("img"),(req,res) => {
  const image = req.file.filename;
  const id = req.body.id;
  const sql = "UPDATE personeller SET image = ? WHERE id = ?";
  db.query(sql, [image, id], (err, result) => {
    if (err) {
      return res.json({ Message: "Error updating image.", error: err });
    }
    return res.json({ Status: "success" });
  });
})

app.get("/upload/:id", (req, res) => {
  const id = req.params.id;

  const sql = "SELECT image,gender FROM personeller WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.json({ Message: "Error getting image.", error: err });
    }
    return res.json(result);
  });
});

app.get("/upload", (req, res) => {

  const sql = "SELECT image, id FROM personeller";
  db.query(sql, (err, result) => {
    if (err) {
      return res.json({ Message: "Error getting image.", error: err });
    }
    return res.json(result);
  });
});

app.get("/getAllUsers", (req, res) => {
  const sql = "SELECT * FROM login";
  db.query(sql, (err, result) => {
    if (err) {
      return res.json({ Message: "Error getting image.", error: err });
    }
    return res.json(result);
  });
});

app.get("/getAllEmployees", (req, res) => {
  const sql = "SELECT * FROM izinler";
  db.query(sql, (err, result) => {
    if (err) {
      return res.json({ Message: "Error getting image.", error: err });
    }
    return res.json(result);
  });
});

app.get("/employeeLeaves/:userID", (req, res) => {
  const userID = req.params.userID;

  const sql = "SELECT baslangic, bitis, TIMESTAMPDIFF(HOUR, baslangic, bitis) AS gunVeSaatFarki FROM izinler WHERE userID = ?";


  db.query(sql, [userID], (err, result) => {
    if (err) {
      return res.json({ Message: "Error getting employee leaves.", error: err });
    }
    return res.json(result);
  });
});

app.get("/employeeLeavesName/:id", (req, res) => {
  const id = req.params.id; 

  const sql = "SELECT isim FROM personeller WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.json({ Message: "Error getting employee count.", error: err });
    }
    return res.json(result);
  });
});


app.get("/employeeNumber/:firmaID", (req, res) => {
  const firmaID = req.params.firmaID; 

  const sql = "SELECT COUNT(*) AS count FROM personeller WHERE firmaID = ?";
  db.query(sql, [firmaID], (err, result) => {
    if (err) {
      return res.json({ Message: "Error getting employee count.", error: err });
    }
    const employeeCount = result[0].count || 0;
    return res.json({ count: employeeCount });
  });
});

app.get("/advanceMoney/:firmaID", (req, res) => {
  const firmaID = req.params.firmaID;

  const sql = "SELECT SUM(avans) AS totalAdvanceMoney FROM personeller WHERE firmaID = ?";
  db.query(sql, [firmaID], (err, result) => {
    if (err) {
      return res.json({ Message: "Error getting advance money.", error: err });
    }

    const totalAdvanceMoney = result[0].totalAdvanceMoney;
    return res.json({ totalAdvanceMoney });
  });
});

app.get("/totalAdvanceMoney", (req, res) => {
  const firmaID = req.params.firmaID;

  const sql = "SELECT SUM(avans) AS totalMoney FROM personeller";
  db.query(sql, [firmaID], (err, result) => {
    if (err) {
      return res.json({ Message: "Error getting advance money.", error: err });
    }

    const totalMoney = result[0].totalMoney;
    return res.json({ totalMoney });
  });
});

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:"myapp"
})


app.get('/', function(req, res) {
  if(req.session.email){
    return res.json({valid:true, email: req.session.email, rol:req.session.rol})
  }else{
    return res.json({valid:false});
  }
});
app.get('/employees', function(req, res) {
  if(req.session.email){
    return res.json({valid:true, email: req.session.email, rol: req.session.rol, gender: req.session.gender})
  }else{
    return res.json({valid:false});
  }
});


app.get('/companies', function(req, res) {
  if(req.session.email){
    return res.json({valid:true, email: req.session.email, rol:req.session.rol})
  }else{
    return res.json({valid:false});
  }
});

app.post("/myapp", (req, res) => {
    const sql1 = "SELECT COUNT(*) AS count FROM login WHERE email = ?";
    const email = req.body.email;

    db.query(sql1, [email], (err, result) => {
        const count = result[0].count;
        if (count > 0) {
            console.log("Email already in use");
            return res.json("emailError");
        } else {
            const values = [
                req.body.username,
                req.body.email,
                req.body.password
            ];
            const sql2 =
                "INSERT INTO login (username, email, password) VALUES (?, ?, ?)";

            db.query(sql2, values, (err, data) => {
                return res.json(data);
            });
        }
    });
});

app.post("/personeldetaylari", (req, res) => {
  const telefon = req.body.telefon;
  const github = req.body.github;
  const linkedIn = req.body.linkedIn;
  const hakkımda = req.body.hakkımda;
  const id = req.body.id;

  const sql = "SELECT COUNT(*) AS count FROM personeldetaylari WHERE `id` = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "An error occurred while executing the query" });
    }
    const count = result[0].count;
    if (count > 0) {
      const sql1 = `UPDATE personeldetaylari SET telefon = ?, github = ?, linkedIn = ?, hakkımda = ? WHERE id = ?`;
      db.query(sql1, [telefon, github, linkedIn, hakkımda, id], (err, data) => {
        if (err) {
          console.error("Database query error:", err);
          return res.status(500).json({ error: "An error occurred while executing the query" });
        }
        return res.json(data);
      });
    } else {
      const sql2 = "INSERT INTO personeldetaylari (telefon, github, linkedIn, hakkımda, id) VALUES (?, ?, ?, ?, ?)";
      db.query(sql2, [telefon, github, linkedIn, hakkımda, id], (err, data) => {
        if (err) {
          console.error("Database query error:", err);
          return res.status(500).json({ error: "An error occurred while executing the query" });
        }
        return res.json(data);
      });
    }
  });
});

app.post("/firmadetaylari", (req, res) => {
  const firmaTelefon = req.body.firmaTelefon;
  const firmaEmail = req.body.firmaEmail;
  const firmaAdres = req.body.firmaAdres;
  const id = req.body.id;

  const sql = "SELECT COUNT(*) AS count FROM firmadetaylari WHERE `id` = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "An error occurred while executing the query" });
    }
    const count = result[0].count;
    if (count > 0) {
      const sql1 = `UPDATE firmadetaylari SET firmaTelefon = ?, firmaEmail = ?, firmaAdres = ? WHERE id = ?`;
      db.query(sql1, [firmaTelefon, firmaEmail, firmaAdres, id], (err, data) => {
        if (err) {
          console.error("Database query error:", err);
          return res.status(500).json({ error: "An error occurred while executing the query" });
        }
        return res.json(data);
      });
    } else {
      const sql2 = "INSERT INTO firmadetaylari (firmaTelefon, firmaEmail, firmaAdres, id) VALUES (?, ?, ?, ?)";
      db.query(sql2, [firmaTelefon, firmaEmail, firmaAdres, id], (err, data) => {
        if (err) {
          console.error("Database query error:", err);
          return res.status(500).json({ error: "An error occurred while executing the query" });
        }
        return res.json(data);
      });
    }
  });
});

app.get("/firmadetaylari", (req, res) => {
  const sql = "SELECT * FROM `firmadetaylari`";
  db.query(sql, (err, data) => { 
    if (err) {
      console.log(err);
    }
    const row = data;
    res.json(row);  
  });
});



app.get("/personeldetaylari/:id", (req, res) => {
  const id = req.params.id;
 
  const sql2 = "SELECT COUNT(*) AS count FROM personeldetaylari WHERE `id` = ?";

  db.query(sql2, [id], (err, result) => {
        const count = result[0].count;
        if (count > 0) {
          const sql = "SELECT * FROM `personeldetaylari` WHERE id = ?";
          db.query(sql, [id], (err, data) => { 
            if (err) {
              console.log(err);
            }
            return res.json(data); 
          });
        } else {
          return res.json("No data");
        }
    });
});

app.get("/firmadetaylari/:id", (req, res) => {
  const id = req.params.id;
 
  const sql2 = "SELECT COUNT(*) AS count FROM firmadetaylari WHERE `id` = ?";

  db.query(sql2, [id], (err, result) => {
        const count = result[0].count;
        if (count > 0) {
          const sql = "SELECT * FROM `firmadetaylari` WHERE id = ?";
          db.query(sql, [id], (err, data) => { 
            if (err) {
              console.log(err);
            }
            return res.json(data); 
          });
        } else {
          return res.json("No data");
        }
    });
});



app.get("/personeldetaylari", (req, res) => {
  const sql = "SELECT * FROM `personeldetaylari`";
  db.query(sql, (err, data) => { 
    if (err) {
      console.log(err);
    }
    const row = data;
    res.json(row); 
  });
});

app.post("/personeller", (req, res) => {
  const isim = req.body.isim;
  const firmaID = req.body.firmaID;
  const yaş = req.body.yaş;
  const avans = req.body.avans;
  const gender = req.body.gender;
  const id = req.body.id;

  const sql = "SELECT COUNT(*) AS count FROM personeller WHERE `id` = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "An error occurred while executing the query" });
    }
    const count = result[0].count;
    if (count > 0) {
      const sql1 = `UPDATE personeller SET isim = ?, yaş = ?, firmaID = ?, avans = ?,gender = ? WHERE id = ?`;
      db.query(sql1, [isim, yaş, firmaID, avans,gender, id], (err, data) => {
        if (err) {
          console.error("Database query error:", err);
          return res.status(500).json({ error: "An error occurred while executing the query" });
        }
        return res.json(data);
      });
    } else {
      const sql2 = "INSERT INTO personeller (isim, yaş, firmaID, avans,gender, id) VALUES (?, ?, ?, ?, ?, ?)";
      db.query(sql2, [isim, yaş, firmaID, avans,gender, id], (err, data) => {
        if (err) {
          console.error("Database query error:", err);
          return res.status(500).json({ error: "An error occurred while executing the query" });
        }
        return res.json(data);
      });
    }
  });
});


app.delete("/personeller/:id", (req, res) => {
  const id = req.params.id;
  
  const sql = "DELETE FROM personeller WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "An error occurred while executing the query" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }
    return res.json({ message: "Employee deleted successfully" });
  });
});

app.delete("/personeldetaylari/:id", (req, res) => {
  const id = req.params.id;
  
  const sql = "DELETE FROM personeldetaylari WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "An error occurred while executing the query" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }
    return res.json({ message: "Employee deleted successfully" });
  });
});

app.delete("/deleteUser/:id", (req, res) => {
  const id = req.params.id;
  
  const sql = "DELETE FROM login WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "An error occurred while executing the query" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({ message: "User deleted successfully" });
  });
});

app.delete("/firmalar/:id", (req, res) => {
  const id = req.params.id;
  
  const sql1 = "SELECT COUNT(*) AS count FROM personeller WHERE `firmaID` = ?";

  db.query(sql1,[id], (err,res1) => {
    if(err){
      console.error(err);
    }
    const count = res1[0].count;
    if(count>0){
      return res.json({message: "company error"})
    }else{
        const sql = "DELETE FROM firmalar WHERE id = ?";
        db.query(sql, [id], (err, result) => {
          if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ error: "An error occurred while executing the query" });
          }
          if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Company not found" });
          }
          return res.json({ message: "Company deleted successfully" });
        });
    }
  });
});

app.delete("/firmadetaylari/:id", (req, res) => {
  const id = req.params.id;

  const sql1 = "SELECT COUNT(*) AS count FROM personeller WHERE `firmaID` = ?";

  db.query(sql1,[id], (err,res1) => {
    if(err){
      console.error(err);
    }
    const count = res1[0].count;
    if(count>0){
      return res.json({message: "company error"})
    }else{          
      const sql = "DELETE FROM firmadetaylari WHERE id = ?";
      db.query(sql, [id], (err, result) => {
        if (err) {
          console.error("Database query error:", err);
          return res.status(500).json({ error: "An error occurred while executing the query" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Company not found" });
        }
        return res.json({ message: "Company deleted successfully" });
      });
    }
  });
});
app.delete("/leaves/:userID", (req, res) => {
  const userID = req.params.userID;
  
  const sql = "DELETE FROM izinler WHERE userID = ?";
  db.query(sql, [userID], (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "An error occurred while executing the query" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }
    return res.json({ message: "Employee deleted successfully" });
  });
});


app.post("/firmalar", (req, res) => {
  const firmaIsmi = req.body.firmaIsmi;
  const id = req.body.id;

  const sql = "SELECT COUNT(*) AS count FROM firmalar WHERE `id` = ?";
  const sql3 = "SELECT COUNT(*) AS count FROM firmalar WHERE `firmaIsmi` = ?";
  db.query(sql3,[firmaIsmi], (err,result) =>{
    if(err){
      console.log(err)
    }else{
      const count1 = result[0].count;
      if(count1>0){
        return res.json({ error: "companyError" });
    }else{
      db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "An error occurred while executing the query" });
    }
    const count = result[0].count;
    if (count > 0) {
      const sql1 = `UPDATE firmalar SET firmaIsmi = ? WHERE id = ?`;
      db.query(sql1, [firmaIsmi, id], (err, data) => {
        if (err) {
          console.error("Database query error:", err);
          return res.status(500).json({ error: "An error occurred while executing the query" });
        }
        return res.json(data);
      });
    } else {
      const sql2 = "INSERT INTO firmalar (firmaIsmi, id) VALUES (?, ?)";
      db.query(sql2, [firmaIsmi, id], (err, data) => {
        if (err) {
          console.error("Database query error:", err);
          return res.status(500).json({ error: "An error occurred while executing the query" });
        }
        return res.json(data);
      });
    }
      });
    }
  }
  });
});



app.post("/login", (req, res) => {
  const sql = "SELECT * FROM login WHERE `email` = ? AND `password` = ?";
  db.query(sql, [req.body.email, req.body.password], (err, data) => {
    if (err) {
      return res.json("Error");
    } else if (data.length > 0) {
      req.session.email = data[0].email;
      req.session.rol = data[0].rol;
      return res.json({Login:true});
    } else {
      return res.json({Login:false});
    }
  });
  });


  app.post("/updateLogin", (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const id = req.body.id;
  
    const sql1 = `UPDATE login SET username = ? , email = ?, password = ? WHERE id = ?`;
        db.query(sql1, [username, email, password, id], (err, data) => {
          if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ error: "An error occurred while executing the query" });
          }
          return res.json(data);
        });
});  

app.get("/getLoginInfo/:id", (req, res) => {
  const id = req.params.id;
  
  const sql = "SELECT * FROM login WHERE `id` = ?";
  db.query(sql, [id], (err, data) => {
      return res.json(data);
  });
});

app.get("/getLeaveName/:id", (req, res) => {
  const id = req.params.id;
  
  const sql = "SELECT isim FROM personeller WHERE `id` = ?";
  db.query(sql, [id], (err, data) => {
      return res.json(data);
  });
});  

  app.get("/login", (req, res) => {
    const sql = "SELECT * FROM login WHERE `email` = ? AND `password` = ?";
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        return res.data;
    });
  });

  app.get("/getUserDetails", (req, res) => {
    const email = req.session.email;
  
    if (!email) {
      return res.status(401).json({ error: "User not logged in" });
    }
  
    const sql = "SELECT username ,rol FROM login WHERE `email` = ?";
    db.query(sql, [email], (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
  
      if (data.length === 0) {
        return res.status(401).json({ error: "User not found" });
      }
  
      const user = data[0];
      const username = user.username;
      const rol = user.rol;
  
      return res.status(200).json({ username,email,rol });
    });
  });


  app.get("/personeller", (req, res) => {
    const sql = "SELECT * FROM personeller";
    db.query(sql, (err, data) => {
      if (err) {
        console.error('Veri çekme hatası: ' + err.stack);
        return;
      }
      const row = data;
      res.json(row); 
    });
  });

  app.get("/leaves", (req, res) => {
    const sql = "SELECT * FROM izinler";
    db.query(sql, (err, data) => {
      if (err) {
        console.error('Veri çekme hatası: ' + err.stack);
        return;
      }
      const row = data;
      res.json(row); 
    });
  });


app.post("/sendLeaves", (req, res) => {
  const baslangic = req.body.baslangic;
  const bitis = req.body.bitis;
  const userID = req.body.userID;

  const sql = "SELECT COUNT(*) AS count FROM izinler WHERE `userID` = ?";
  db.query(sql, [userID], (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "An error occurred while executing the query" });
    }
    const count = result[0].count;
    if (count > 0) {
        return res.json({ error: "leaves error" });
    } else {
      const sql1 = `INSERT INTO izinler (baslangic,bitis, userID) VALUES (?, ?, ?)`;
      db.query(sql1, [baslangic, bitis, userID], (err, data) => {
        if (err) {
          console.error("Database query error:", err);
          return res.status(500).json({ error: "An error occurred while executing the query" });
        }
        console.log(data);
        return res.json(data);
      });
    }
  });
});

  app.get("/firmalar", (req, res) => {
    const sql = "SELECT * FROM firmalar";
    db.query(sql, (err, data) => {
      if (err) {
        console.error('Veri çekme hatası: ' + err.stack);
        return;
      }
      const row = data;
      res.json(row); 
    });
  });

  app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.json({ success: false });
      }
      return res.json({ success: true });
    }); 
  });
  
app.listen(8081, () =>{
    console.log("listening")
})

