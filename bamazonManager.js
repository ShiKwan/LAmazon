var inquirer = require('inquirer')
var mysql = require('mysql')
var cTable = require('console.table')
var dotEnv = require('dotenv')

// create the connection information for the sql database
dotEnv.config()
var sqlPassword = process.env.sqlPassword

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,

  // Your username
  user: 'root',

  // Your password
  password: sqlPassword,
  database: 'bamazon'
})

connection.connect(function (err) {
  if (err) throw err
  // run the start function after the connection is made to prompt the user

  start()
})

function libraryProduct (item_id, product_name, department_name, price, stock_quantity) {
  this.item_id = item_id
  this.product_name = product_name
  this.department_name = department_name
  this.price = price
  this.stock_quantity = stock_quantity
}

function start () {
  inquirer.prompt([
    {
      type: 'list',
      name: 'managerMenu',
      message: 'Hi, what do you plan to do today?',
      choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'I am done']
    }
  ]).then(function (answer) {
    switch (answer.managerMenu) {
      case 'View Products for Sale':
        viewProductForSale()
        break
      case 'View Low Inventory':
        viewLowInv()
        break
      case 'Add to Inventory':
        addToInv()
        break
      case 'Add New Product':
        addNewProduct()
        break
      case 'I am done':
        console.log('Good bye!')
        connection.end()
        break
      default:
        break
    }
  // console.log(answer.managerMenu)
  })
}

function viewProductForSale () {
  var query = connection.query('SELECT * FROM products', function (err, results) {
    if (err) return err
    console.table(results)
    start()
  })
}

function viewLowInv () {
  var query = connection.query('SELECT * FROM products WHERE stock_quantity < 5', function (err, results) {
    if (err) return err
    console.table(results)
    start()
  })
}

function addNewProduct () {
  inquirer.prompt([
    {
      type: 'input',
      name: 'txtProductName',
      message: 'Enter name of the product to put on the rack'
    },
    {
      type: 'input',
      name: 'txtDepartment',
      message: 'Enter the department this product belongs to'
    },
    {
      type: 'input',
      name: 'txtPrice',
      message: 'Enter the price of the product'
    },
    {
      type: 'input',
      name: 'txtStockQuantity',
      message: 'Enter the amount available in stock'
    }
  ]).then(function (answer) {
    var query = connection.query('INSERT INTO products SET ?', {
      product_name: answer.txtProductName,
      department_name: answer.txtDepartment,
      price: answer.txtPrice,
      stock_quantity: answer.txtStockQuantity
    }, function (err) {
      if (err) throw err
      console.log("\n Product '" + answer.txtProductName + "' has been put on rack!\n")
    })
    start()
  })
}
var libraryArray = []

function addToInv () {
  libraryArray = []
  connection.query('SELECT * FROM products', function (err, results) {
    if (err) return err
    for (var i = 0; i < results.length; i++) {
      var newItem = new libraryProduct(parseInt(results[i].item_id), results[i].product_name, results[i].department_name, parseFloat(results[i].price), parseInt(results[i].stock_quantity))
      libraryArray.push(newItem)
    }

    inquirer.prompt(
      [
        {
          type: 'rawlist',
          name: 'lsItemID',
          message: 'Pick an item to re-stock',
          pageSize: 15,
          choices: function () {
            var choiceArray = []
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(JSON.stringify(libraryArray[i].item_id))
            }
            return choiceArray
          }
        }, {
          type: 'input',
          name: 'txtQuantity',
          message: 'Number of item(s) to add',
          validate: function (value) {
            var pass = value.match('^[0-9]*$')
            if (pass) {
              return true
            }
            return 'Please enter a valid number'
          }
        }
      ]
    ).then(function (answer) {
      var userSelected
      for (var i = 0; i < libraryArray.length; i++) {
        if (libraryArray[i].item_id == answer.lsItemID) {
          userSelected = libraryArray[i]
        }
      }
      userSelected.stock_quantity = parseInt(userSelected.stock_quantity) + parseInt(answer.txtQuantity)
      var query = connection.query('UPDATE products SET ? WHERE ? ', [
        {
          stock_quantity: parseInt(userSelected.stock_quantity)
        },
        {
          item_id: userSelected.item_id
        }
      ], function (err) {
        if (err) return err
        console.log('\nItem added to stock successfully!\n')
        // console.log(query.sql)
        start()
      })
    })
  })
}
