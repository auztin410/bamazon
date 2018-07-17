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

// Intitial database connection and displaying list of items available.
connection.connect(function(err) {
    if(err) return console.log(err.message);
    console.log("connected as id " + connection.threadId + "\n");
    displayProducts();
})





function displayProducts(){
    connection.query("SELECT * FROM products", function(err, res){
        if(err) return console.log(err.message);

        console.table(res);
        orderItem();
        // connection.end();
    })
}

function orderItem(){
// Item ordering prompt.
inquirer.prompt([
    {
        name: "itemId",
        input: "text",
        message: "Please select an item's ID number to order."
    },
    {
        name: "itemQuantity",
        input: "text",
        message: "How many would you like?"
    }
]).then(function(answer){
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock: 50
            },
            {
                id: answer.itemId
            }
        ]
    )
});

}

