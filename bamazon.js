var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "root",
    database: "bamazon_db"
});


connection.connect(function(err) {
    if(err) return console.log(err.message);
    console.log("connected as id " + connection.threadId + "\n");
    displayProducts();
})





function displayProducts(){
    connection.query("SELECT * FROM products", function(err, res){
        if(err) return console.log(err.message);

        // console.log(res);
        console.table(res);
        connection.end();
    })
}



