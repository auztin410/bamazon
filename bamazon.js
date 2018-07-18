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
    
    
})

var promptGo = true;
if(promptGo === true){
    displayProducts();
}



function displayProducts(){
    connection.query("SELECT * FROM products", function(err, res){
        if(err) return console.log(err.message);

        // Consoling out a nice table for the various products to choose from.
        console.table(res);
       
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
            
            // For loop and variable to select and store the correct index in the array for the selected item.
            var chosenItem;
            for (var i = 0; i < res.length; i++) {
                if (res[i].id == answer.itemId) {
                  chosenItem = res[i];
                }
            }
            
            

            // Calculating the current stock of an item minus the quantity ordered.
            var updateStock = chosenItem.stock -= answer.itemQuantity;
            var costOfPurchase = chosenItem.price * answer.itemQuantity;
            
            if(updateStock < 0){

                // Console out that bamazon doesn't have enough stock to fulfill the order.
                console.log("Sorry we do not have enough stock to fulfill that order.")

                inquirer.prompt([
                    {
                        name: "promptContinue",
                        type: "confirm",
                        message: "Do you wish to try again?"
                    }
                ]).then(function(answer){
                    if(answer.promptContinue === true){
                        displayProducts();
                    }
                    else{
                        console.log("Sorry for the inconvenience and have a nice day!");
                        connection.end();
                    }
                })
            }

            else{
                // Consoling the quantity and item purchased.
            console.log("You have purchased " + answer.itemQuantity + " " + chosenItem.name);
            console.log("Your total is: $" + costOfPurchase);

            // Setting the new stock number to the appropriate volume after the order.
            var query = connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                    {
                        stock: updateStock
                    },
                    {
                        id: answer.itemId
                    }
                ]
            )

            inquirer.prompt([
                {
                    name: "promptContinue",
                    type: "confirm",
                    message: "Would you like to order anything else?"
                }
            ]).then(function(answer){
                if(answer.promptContinue === true){
                    displayProducts();
                }
                else{
                    console.log("Thanks for using Bamazon and have a great day!")
                    connection.end();
                }
            });
        }
        });
        
    })
}




    
