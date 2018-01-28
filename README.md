# LAmazon

_Welcome to Amazon-like store!_

This interactive app store has three different interfaces (customers, manager, supervisor) built by these npm components: 

    * inquirer
    * mysql
    * console.table

* **Customers Interface:**
    Application will first started by showing user the item-id, item name, and the price.
    Follow by user inputing the desired item-id, and quantity user wants to buy.
        * If the store has the amount of quantity, it will prompt user to prepare the total amount in order to buy the specific item. 
        * Otherwise, application will prompt user about insufficient quantity. 
        
![Bamazon Customer](https://media.giphy.com/media/l3diGb7PbFsvZCbaE/giphy.gif)

        

* **Manager Interface:**
    Application has 4 features. 
    * View Products for Sale
        * Show all products on rack. 
    * View Low Inventory
        * Show all products with lesser than 5 items on rack.
    * Add to Inventory
        * First by prompting user with a list of items on rack, and follow by prompting user to enter the item-id to re-stock, and then the quantity to restock, then application will update the rack with the latest quantity
    * Add New Product
        * Application will guide user step-by-step by asking user to enter the product name, department name, price, and stock quantity, once completed, it will add the items to the rack. 
      
      ![Bamazon Manager - View Product, View Low Inventory, and Re-stock inventory](https://media.giphy.com/media/xUNd9DCFRzWfdPXWQ8/giphy.gif)
      ![Bamazon Manager - Add New Product and View Product](https://media.giphy.com/media/3ohjVaq6FJW9F0cEQ8/giphy.gif)
      

* **Supervisor Interface:**
    Application has 2 features.
    * View Products Sales By Department
        * This will sum the total amount of sales of each category and display the following column name.
            1. Department ID
            1. Department Name
            1. Over Head Costs
            1. Product Sales
            1. Total Profit
    * Create New Department
        * Application will guide user step-by-step by asking user to enter the department name and over_head_costs, once completed, it will add the new departments in the database. 
        
        ![Bamazon Manager - Add New Product and View Product](https://media.giphy.com/media/xT1R9XxXj5xiFYFzcQ/giphy.gif)
        
