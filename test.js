
var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "",
    database: "bamazon"
});
connection.connect(function (err) {
    if (err) throw err;
    start();
});
function start() {
    inquirer
        .prompt({
            name: "bamazon",
            type: "rawlist",
            message: "Would you like to shop at Bamazon?",
            choices: ["SHOP", "LEAVE"]
        })
        // .this is a call back function... what they choose
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.bamazon.toUpperCase() === "SHOP") {
                ShopBamazon();
            } else {
                LeaveBamazon();
            }
        });
}
function ShopBamazon() {
    // query the database for all items being auctioned
    var query = connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to bid on
        inquirer
            .prompt([{
                    name: "bamazon",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < res.length; i++) {
                            choiceArray.push("Department: " + res[i].department_name + " || Product: " + res[i].product_name + " || Price: $" + res[i].price);
                            // console.log("Department: " + res[i].department_name + " || Product: " + res[i].product_name + " || Price: $" + res[i].price);
                        }
                        return choiceArray;
                    },
                    message: "What item by number would you like to purchase?"
                },
                {
                    name: "inventory",
                    type: "input",
                    message: "How many units of this product would you like to purchase?",
                }
            ])
            .then(function (answer) {
                var itemToPurchase;
                for (var i = 0; i < res.length; i++) {
                    if (res[i].product_name === answer.bamazon) {
                        itemToPurchase = res[i];
                    }
                }
                if (itemToPurchase.stock_quantity < parseInt(answer.inventory)) {
                    connection.query (
                        "UPDATE products SET ?",
                        [
                            {
                                stock_quantity: answer.inventory
                            },
                            {
                                item_id: chosenItem.item_id
                            }
                        ],
                        
                        function (err) {
                            if (err) throw err;
                        console.log('Your order was placed successfully.');
                    }
                    );
                }
                else {
                    console.log('We do not have the inventory to full your order.');
                    start();
                }
    });
});
}
function LeaveBamazon() {
    console.log("------------------------------------------------------");
    console.log("Thank you for visiting Bamazon. We hope you come back soon.");
    connection.end();
}