/*
REGISTRATION
Route: /register_tenant
Require: unit_id[not implemented yet], username, password, lease_id[not implemented yet]

ALL USERS PROFILE
Route: /all_tanants
Require: NIL

CURRENT USER PROFILE
Route: /tenant
Require: tenant_user_id

UPDATE POFILE
Route: /update_tenant
Require: tenant_user_id, username, password

DELETE USER
Route: /delete_tenant
Require: tenant_user_id
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
app.post('/register_tenant' , (req, res) => {

    /*
    TODO:
    need building name, postal code to get the building id, then using building id, floor and unit number to get unit id then from unit id, username, password, lease id create tenant user
    */

    const username = req.body.username;
    const password = req.body.password;

    db.query(
        'INSERT INTO tenant_user (unit_id, username, password, lease_id) VALUES (1,?,?,1)', 
        [username, password], 
        (err, result) => {
            if (err) {
                console.log(err)
            } else{
                res.send("tenant registration successful")
            }
        }
    );

});

// ALL USERS PROFILE
app.get('/all_tenants', (req, res) => {
    db.query(
        'SELECT tu.tenant_user_id, tu.username, tu.password, u.floor, u.unit_number FROM tenant_user tu LEFT JOIN unit u on tu.unit_id = u.unit_id',
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        })
})

// CURRENT USER PROFILE
app.get('/tenant', (req, res) => {

    const tenant_user_id = req.body.id;

    db.query(
        'SELECT tu.tenant_user_id, tu.username, tu.password, u.floor, u.unit_number FROM tenant_user tu LEFT JOIN unit u on tu.unit_id = u.unit_id WHERE tu.tenant_user = ?',
        [tenant_user_id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        })
})

// UPDATE PROFILE
app.put('/update_tenant', (req,res) => {

    const tenant_user_id = req.body.id;
    const username = req.body.username;
    const password = req.body.password;

    db.query(
        'UPDATE tenant_user SET username = ?, password = ? WHERE tenant_user_id = ?',
        [username, password, tenant_user_id],
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
app.delete('/delete_tenant', (req,res) => {

    const tenant_user_id = req.body.id;

    db.query(
        'DELETE FROM tenant_user WHERE tenant_user_id = ?',
        [tenant_user_id],
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