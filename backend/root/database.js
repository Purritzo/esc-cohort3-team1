// import dependencies here
//require("dotenv").config()
//const express = require('express');
//const app = express();
const { createPool } = require("mysql2");
//const { genSaltSync, hashSync } = require('bcrypt')
//const cors = require('cors');

//app.use(cors());
//app.use(express.json());

// create db connection
const pool = createPool({
    user            :   process.env.DATABASE_ROOT,
    host            :   process.env.DATABASE_HOST,
    password        :   process.env.DATABASE_PASSWORD,
    database        :   process.env.DATABASE,
    port            :   process.env.DATABASE_PORT,
    connectionLimit :   10
});

module.exports = pool;
/*
// check db connection
pool.connect(function(err) {
    if (err) throw err;
    console.log('Database is connected successfully !');
});

app.use((req, res, next) => {
    console.log(req.body);
    next();
} )


app.get('/get_landlord', (req,res) =>{
    res.json({
        success: 1,
        message: "This is rest api working"
    });
})

app.post('/create_landlord', (req,res) => {
    //console.log(req.body)
    const name = req.body.landlord_user;
    let landlord_password1 = req.body.landlord_password1;
    const landlord_password2 = req.body.landlord_password2;
    const ticket_type = req.body.landlord_ticket;

    if (landlord_password1 === landlord_password2) {

        const salt = genSaltSync(10);
        landlord_password1 = hashSync(landlord_password1, salt);

        db.query(
            'INSERT INTO landlord_user (building_id, username, password, ticket_type) VALUES (1,?,?,?)',
            [name,landlord_password1,ticket_type],
            (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Values inserted");
                }
            })

    } else {
        res.send("passwords are not the same")
    }
    
})
*/