var inquirer = require('inquirer')
var mysql = require('mysql')
var cTable = require('console.table')

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,

  // Your username
  user: 'root',

  // Your password
  password: 'Gobigblue97',
  database: 'bamazon'
})

var libraryArray = []
var toDisplayArray = []
function libraryProduct (item_id, product_name, department_name, price, stock_quantity) {
  this.item_id = item_id
  this.product_name = product_name
  this.department_name = department_name
  this.price = price
  this.stock_quantity = stock_quantity
  this.product_sales
}
function toDisplay (item_id, product_name, price) {
  this.item_id = item_id
  this.product_name = product_name
  this.price = price
}

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err
  // run the start function after the connection is made to prompt the user

  start()
})

function start () {
  inquirer.prompt([
    {
      type: 'rawlist',
      name : 'lsStart',
      message : 'Good day! What do you want to do today?',
      choices : ['Buy item', 'I am done']
    }
  ]).then(function(answer){
    //console.log(answer);
    switch (answer.lsStart){
      case 'Buy item':
        buy();
        break;
      case 'I am done':
        console.log("Good bye!")
        connection.end();
        break;
    }
  })
}


function buy () {
  libraryArray = []
  toDisplayArray = []
  connection.query('SELECT * FROM products', function (err, results) {
    if (err) return err
    for (var i = 0; i < results.length; i++) {
      var newItem = new libraryProduct(parseInt(results[i].item_id), results[i].product_name, results[i].department_name, parseFloat(results[i].price), parseInt(results[i].stock_quantity))
      var newtoDisplay = new toDisplay(parseInt(results[i].item_id), results[i].product_name, parseFloat(results[i].price))
      if (results[i].product_sales) {
        newItem.product_sales = results[i].product_sales
      }else {
        newItem.product_sales = 0
      }
      libraryArray.push(newItem)
      toDisplayArray.push(newtoDisplay)
      
    }
    console.log("\n")
    console.table(toDisplayArray)
    /* for (var i = 0; i < libraryArray.length; i++) {
      console.log('item id : ' + libraryArray[i].item_id + ' | product name : ' + libraryArray[i].product_name + ' | price : $ ' + libraryArray[i].price)
    } */
    // console.log(libraryArray)

    inquirer.prompt([{
      name: 'itemID',
      type: 'list',
      message: 'Pick an ID of the items you are buying',
      pageSize: 15,
      choices: function () {
        var choiceArray = []
        for (var i = 0; i < results.length; i++) {
          choiceArray.push(JSON.stringify(libraryArray[i].item_id))
        }
        return choiceArray
      }
    }, {
      name: 'itemQty',
      type: 'input',
      message: 'Enter number of quantity you want to buy',
      default: function () {
        return 1
      },
      validate: function (value) {
        var pass = value.match('^[0-9]*$')
        if (pass) {
          return true
        }
        return 'Please enter a valid quantity'
      }
    }]).then(function (answer) {
      // console.log(libraryArray)
      var userSelected
      for (var i = 0; i < libraryArray.length; i++) {
        if (libraryArray[i].item_id == answer.itemID) {
          userSelected = libraryArray[i]
          // console.log(libraryArray[i].product_sales)
          if (libraryArray[i].product_sales) {
            userSelected.product_sales = libraryArray[i].product_sales
          }else {
            userSelected.product_sales = 0
          }
        }
      }
      // console.log('user selected stock quantity = ' + parseInt(userSelected.stock_quantity) + ', user answered : ' + parseInt(answer.itemQty))
      if (parseInt(userSelected.stock_quantity) < parseInt(answer.itemQty)) {
        console.log('\namount user wanted to buy exceeded stock inventory!\n')
        start()
      }else {
        // console.log('prepare to buy item from bamazon!')
        var total = parseInt(answer.itemQty) * parseFloat(userSelected.price)
        userSelected.product_sales = parseFloat(userSelected.product_sales) + total
        // console.log('product sales : ' + userSelected.product_sales)
        userSelected.stock_quantity = userSelected.stock_quantity - answer.itemQty
        console.log('\nPlease prepare $' + parseFloat(total, 2) + ' to buy ' + userSelected.product_name + '. Thank you for shopping with us!\n')
        updateBamazonStore(parseInt(userSelected.stock_quantity), parseInt(userSelected.item_id), parseFloat(userSelected.product_sales))
      }
    })
  })
}

function updateBamazonStore (itemQty, itemID, productSales) {
  // console.log('here')
  var query = connection.query('UPDATE products SET ? WHERE ?',
    [{ stock_quantity: itemQty, product_sales: productSales }, { item_id: itemID }],
    function (err) {
      if (err) throw err
      console.log('\nItem bought successfully!\n')
      //console.log(query.sql)
      start()
    })
}
