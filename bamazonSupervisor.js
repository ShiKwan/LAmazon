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

connection.connect(function (err) {
  if (err) return err
  start()
})

function start () {
  inquirer.prompt([{
    type: 'rawlist',
    name: 'lsOption',
    message: 'What you want to do today?',
    choices: ['View Product Sales By Department', 'Create New Department', 'I am done' ]
  }]).then(function (answer) {
    //console.log(answer)
    switch (answer.lsOption) {
      case 'View Product Sales By Department':
        console.log('view product sales in department')
        viewProdSales()
        break
      case 'Create New Department':
        console.log('create new department')
        createNewDepartment()
        break
      case 'I am done':
        console.log('Good bye!')
        connection.end();
        break
    }
  })
}

function viewProdSales () {
  connection.query('SELECT departments.department_id, departments.department_name, departments.over_head_costs, sum(products.product_sales) as product_sales, sum(products.product_sales - departments.over_head_costs) as total_profit ' +
    ' from products inner join departments ' +
    ' on products.department_name = departments.department_name ' +
    ' group by departments.department_id, departments.department_name, departments.over_head_costs, departments.over_head_costs ', function (err, result) {
      if (err) return err
      //console.log(result)
      console.table(result);
      start()
      // console.log(result)

    })
}

function createNewDepartment () {
  inquirer.prompt([
    {
      type: 'input',
      name: 'txtDepartment',
      message: 'enter the new department name...'
    },
    {
      type: 'input',
      name: 'txtOverHeadCosts',
      message: 'enter the over head costs of that department'
    }
  ]).then(function (answer) {
    connection.query('insert into departments (department_name, over_head_costs) values ? ', [
      {
        department_name: answer.txtDepartment,
        over_head_costs: answer.txtOverHeadCosts
      }
    ])
    console.log("Added a new department '" + answer.txtDepartment + "' with over head cost of $" + answer.txtOverHeadCosts)
    start()
  })
}
