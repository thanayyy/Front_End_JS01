var express = require('express')
var axios = require('axios')
var app = express()
var bodyParser = require('body-parser')
var path = require("path")
const { Console } = require('console')
const { name } = require('ejs')

var base_url = "http://localhost:3000"
app.set("views", path.join(__dirname, "/public/views"))
app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(__dirname + '/public'))
var Name_Customer
var Id_Customer

function Register_Login() {
    app.get('/', (req, res) => res.render("Register_Login/index"))

    app.get('/Sign_in', async(req, res) => res.render("Register_Login/Sign_in"))

    app.get('/Sign_up', async(req, res) => res.render("Register_Login/Sign_up"))


    app.post('/Confrim_Register', async(req, res) => {
        try {


            const data_Customer = {
                Name: req.body.Name,
                Phone: req.body.Phone,
                Email: req.body.Email,
                Address: req.body.Address,
                Password: req.body.Password
            }
            Name_Customer = data_Customer.Name
            await axios.post(base_url + '/Customer_Post', data_Customer)
            const respones = await axios.get(base_url + '/Customers')
            res.render("Shop_Index", { Customers: respones.data, Name: Name_Customer })

        } catch (err) {
            console.error(err)
            res.status(500).send('Error Post Register')
        }

    })


    app.post('/Register_Customer', async(req, res) => {
        try {

            const data_Customer = {
                Name: req.body.Name,
                Phone: req.body.Phone,
                Email: req.body.Email,
                Address: req.body.Address,
                Password: req.body.Password
            }
            const respones = await axios.get(base_url + '/Customers')
            res.render("Register_Login/Check_Register", { Customer: data_Customer, Customers: respones.data })



        } catch (err) {
            console.error(err)
            res.status(500).send('Error3')
        }
    })
    app.post('/Login_Customer', async(req, res) => {
        try {

            const data_login = {
                Name: req.body.Name,
                Password: req.body.Password
            }
            Name_Customer = data_login.Name

            const respones = await axios.get(base_url + '/Customers')
            res.render("Register_Login/Check_Login", { Customer: data_login, Customers: respones.data })




        } catch (err) {
            console.error(err)
            res.status(500).send('Error3')
        }
    })
}


app.get('/Pawn_Shop', async(req, res) => {
    const respones = await axios.get(base_url + '/Customers')
    res.render("Shop_Index", { Customers: respones.data, Name: Name_Customer })
})


function Pawn_Product() {
    app.get('/Pawn_Product/:Name/:Id', async(req, res) => {
        Id_Customer = req.params.Id
        const respones = await axios.get(base_url + '/Customers')
        res.render("Pawn_Product/Pawn_Product", { Name: req.params.Name, Id: req.params.Id })

    })

    app.post('/Data_Product', async(req, res) => {
        const data_Product = {
            Customer_Id: req.body.Customer_Id,
            Name: req.body.Name,
            Value: req.body.Value,
        }
        await axios.post(base_url + '/Item_Post', data_Product)
        const respones_Item = await axios.get(base_url + '/Items')
        const respones_Employee = await axios.get(base_url + '/Employees')
        res.render("Pawn_Product/Ticket_Pawn", {
            Id_Customer: Id_Customer,
            Item: respones_Item.data,
            Employee: respones_Employee.data
        })
    })

    app.get('/Record_Pawn/:Customer_Id', async(req, res) => {
        const respones_Item = await axios.get(base_url + '/Items')
        const respones_Ticket = await axios.get(base_url + '/Tickets')

        res.render("Pawn_Product/Record_Pawn", {
            Id: req.params.Customer_Id,
            Name: Name_Customer,
            Items: respones_Item.data,
            Tickets: respones_Ticket.data
        })
    })

    app.post('/Ticket_Pawn', async(req, res) => {
        const data_ticket = {
            Customer_Id: req.body.Customer_Id,
            Product_Id: req.body.Product_Id,
            Employee_Id: req.body.Employee_Id,
            Principle: req.body.Principle,
            Rate: req.body.Rate,
            Total: req.body.Total
        }
        await axios.post(base_url + '/Ticket_Post', data_ticket)
        res.redirect("/Pawn_Shop")
    })

}

function Customer() {

    app.get('/Customer_Page', async(req, res) => {
        const respones = await axios.get(base_url + '/Customers')
        res.render("Customer/Customer", { Customers: respones.data })
    })

    app.get('/Customer/:Customer_Id', async(req, res) => {
        const respones = await axios.get(base_url + '/Customer/' + req.params.Customer_Id)
        res.render("Customer/View_Customer", { Customer: respones.data })
    })

    app.get('/Update_Customer/:Customer_Id', async(req, res) => {
        const respones = await axios.get(base_url + '/Customer/' + req.params.Customer_Id)
        res.render("Customer/Update_Customer", { Customer: respones.data })
    })

    app.post('/Put_Customer/:Customer_Id', async(req, res) => {
        const data_Customer = {
            Name: req.body.Name,
            Phone: req.body.Phone,
            Email: req.body.Email,
            Address: req.body.Address,
            Password: req.body.Password
        }
        Name_Customer = req.body.Name
        await axios.put(base_url + '/Customer_Update/' + req.params.Customer_Id, data_Customer)
        const respones_Cus = await axios.get(base_url + '/Customers')
        res.render("Shop_Index", { Name: Name_Customer, Customers: respones_Cus.data })
    })

    app.get('/delete/:Customer_Id', async(req, res) => {

        await axios.delete(base_url + '/Customer_Delete/' + req.params.Customer_Id)
        res.redirect('/')
    })

}

function Employee() {
    app.get('/Employee_Page', async(req, res) => {
        const respones = await axios.get(base_url + '/Employees')
        res.render("Employee/Employee", { Employees: respones.data })
    })

    app.get('/Create_Employee', async(req, res) => {
        res.render("Employee/Create_Employee")
    })

    app.post('/Employee_Post', async(req, res) => {
        const data_Employee = {
            Name: req.body.Name,
            Phone: req.body.Phone,
            Salary: req.body.Salary,
            Post: req.body.Post
        }
        await axios.post(base_url + '/Employee_Post', data_Employee)
        res.redirect("Employee_Page")
    })

    app.get('/Employee/:Employee_Id', async(req, res) => {
        const respones = await axios.get(base_url + '/Employee/' + req.params.Employee_Id)
        res.render("Employee/View_Employee", { Employee: respones.data })
    })

    app.get('/Update_Employee/:Employee_Id', async(req, res) => {
        const respones = await axios.get(base_url + '/Employee/' + req.params.Employee_Id)
        res.render("Employee/Update_Employee", { Employee: respones.data })
    })

    app.post('/Put_Employee/:Employee_Id', async(req, res) => {
        const data_Employee = {
            Name: req.body.Name,
            Phone: req.body.Phone,
            Salary: req.body.Salary,
            Post: req.body.Post
        }

        await axios.put(base_url + '/Employee_Update/' + req.params.Employee_Id, data_Employee)
        res.redirect('/Employee_Page')

    })

    app.get('/Delete_Employee/:Employee_Id', async(req, res) => {

        await axios.delete(base_url + '/Employee_Delete/' + req.params.Employee_Id)
        res.redirect('/Employee_Page')
    })

}

function Item() {
    app.get('/Item_Page', async(req, res) => {

        const respones = await axios.get(base_url + '/Items')
        res.render("Item/Item", { Items: respones.data })
    })

    app.get('/Item/:Product_Id', async(req, res) => {
        const respones = await axios.get(base_url + '/Item/' + req.params.Product_Id)
        res.render("Item/View_Item", { Item: respones.data })
    })

    app.get('/Update_Item/:Product_Id', async(req, res) => {
        const respones = await axios.get(base_url + '/Item/' + req.params.Product_Id)
        res.render("Item/Update_Item", { Item: respones.data })
    })

    app.post('/Put_Item/:Product_Id', async(req, res) => {
        const data_Item = {
            Name: req.body.Name,
            Value: req.body.Value
        }

        await axios.put(base_url + '/Item_Update/' + req.params.Product_Id, data_Item)
        res.redirect("/Item_Page")
    })

    app.get('/Delete_Item/:Product_Id', async(req, res) => {

        await axios.delete(base_url + '/Item_Delete/' + req.params.Product_Id)
        res.redirect("/Item_Page")
    })

}

function Ticket() {

    app.get('/Ticket', async(req, res) => {
        const respones = await axios.get(base_url + '/Tickets')
        res.render("Ticket/Ticket", { Tickets: respones.data })
    })




}

Register_Login()

Pawn_Product()
Customer()
Employee()
Item()
Ticket()

app.listen(5500, () => console.log(`Listening on port 5500`))