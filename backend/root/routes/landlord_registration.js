/*
REGISTRATION
Route: /register_landlord
Require: building_name[not implemented yet], username, password, ticket_type

ALL USERS PROFILE
Route: /all_landlords
Require: NIL

CURRENT USER PROFILE
Route: /landlord
Require: landlord_user_id

UPDATE POFILE
Route: /update_landlord
Require: landlord_user_id, building_name[not implemented yet], username, password, ticket_type

DELETE USER
Route: /delete_landlord
Require: landlord_user_id
*/

const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');

app.use(cors());
app.use(express.json());

// create connection with db
const db = mysql.createConnection({
    user : 'root',
    host : 'localhost',
    password : '',
    database : '50003_database',
});
// check db connection
db.connect(function(err) {
    if (err) throw err;
    console.log('Database is connected successfully !');
});

// REGISTRATION
app.post('/register_landlord' , (req, res) => {

    const username = req.body.username;
    const password = req.body.password;
    const ticket_type = req.body.ticket_type;

    db.query(
        'INSERT INTO landlord_user (building_id, username, password, ticket_type) VALUES (1,?,?,?)', 
        [result.building_id, username, password, ticket_type], 
        (err, result) => {
            if (err) {
                console.log(err)
            } else{
                res.send("landlord registration successful")
            }
        }
    );

});

// ALL USERS PROFILE
app.get('/all_landlords', (req, res) => {
    db.query(
        'SELECT lu.landlord_user_id, lu.username, lu.password, lu.ticket_type, b.building_name FROM landlord_user lu LEFT JOIN building b on lu.building_id = b.building_id',
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        })
})

// CURRENT USER PROFILE
app.get('/landlord', (req, res) => {

    const landlord_user_id = req.body.id;

    db.query(
        'SELECT lu.landlord_user_id, lu.username, lu.password, lu.ticket_type, b.building_name FROM landlord_user lu LEFT JOIN building b on lu.building_id = b.building_id WHERE lu.landlord_user = ?',
        [landlord_user_id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        })
})

// UPDATE PROFILE
app.put('/update_landlord', (req,res) => {

    const landlord_user_id = req.body.id;
    const username = req.body.username;
    const password = req.body.password;
    const ticket_type = req.body.ticket_type;

    db.query(
        'UPDATE landlord_user SET username = ?, password = ?, ticket_type = ? WHERE landlord_user_id = ?',
        [username, password, ticket_type, landlord_user_id],
        (err, result) => {
            if (err) {
                console.log(err)
            } else{
                res.send(result)
            }
        }
    )
});

// DELETE USER
app.delete('/delete_landlord', (req,res) => {

    const landlord_user_id = req.body.id;

    db.query(
        'DELETE FROM landlord_user WHERE landlord_user_id = ?',
        [landlord_user_id],
        (err, result) => {
            if (err) {
                console.log(err)
            } else{
                res.send(result)
            }
        }
    )
})

app.listen(3307, () => {
    console.log("server is running on port 3307")
})