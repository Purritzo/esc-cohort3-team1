// import dependencies here
const express = require('express');
const mysql = require("mysql2");

const app = express();
const db = mysql.createConnection({
    user    :   'root',
    host    :   'localhost',
    password:   "",
    database:   "50003_database"
});
/*
app.post('/create', (req,res) => {
    const name = req.body.landlord_user;
    const landlord_password1 = req.body.landlord_password1;
    const landlord_password2 = req.body.landlord_password2;
    const ticket_type = req.body.landlord_ticket;

    if (landlord_password1 === landlord_password2) {
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
        console.log("passwords are not the same")
    }
    
})
*/

app.listen(3001, () => {
    console.log("server running on port 3001")
});

