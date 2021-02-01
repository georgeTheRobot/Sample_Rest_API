const express = require('express');
const Joi = require('joi');
const app = express();
app.use(express.json());

//Give data to the server
const customers = [
    {title: 'George', id: 1},
    {title: 'Josh', id: 2},
    {title: 'Tyler', id: 3},
    {title: 'Alice', id: 4},
    {title: 'Candice', id: 5}
]

//Display the Message when the URL consist of '/'
app.get('/', (req, res) => {
    res.send('Welcome to my First REST API');
});

//Display the list of customers when the URL consists of api customers
app.get('/api/customers', (req,res) => {
    res.send(customers);
});

//Display the information of specific customer when you mention the id
app.get('/api/customers/:id', (req,res) => {
    const customer = customers.find(c => c.id === parseInt(req.params.id));
//if there is no valid customer ID, then display an error with the following message
    if (!customer) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Ooops... Cant find what you are looking for.</h2>');
    res.send(customer);    
});

//create request handler
//create new customer informtion
app.post('/api/customers', (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) {
        res.status(400).send(error.details[0].message)
        return;
    }
    //increment the customer id
    const customer = {
        id: customers.length + 1,
        title: req.body.title
    };
    customers.push(customer);
    res.send(customer);
});

//update existing customer information
app.put('/api/customers/:id', (req, res) => {
    const customer = customers.find(c=> c.id === parseInt(req.params.id));
    if (!customer) res.status(404).send('<h2>Not Found!!</h2>');

    const { error } = validateCustomer(req.body);
    if (error) {
        res.ststus(400).send(error.details[0].message);
        return;
    }
    
    customer.title = req.body.title;
    res.send(customer);
});

//Delete Request Handler
//delete customer details
app.delete('/api/customers/:id', (req, res) => {
    const customer = customers.find( c=> c.id === parseInt(req.params.id));
    if(!customer) res.status(404).send('<h2>Success</h2>');

    const index = customers.indexOf(customer);
    customers.splice(index,1);

    res.send(customer);
})

//Validate Information
function validateCustomer(customer) {
    const schema = {
        title: Joi.string().min(3).required()
    };
    return Joi.validate(customer, schema);
}


//port environment variable
const port = process.env.PORT || 8080;
app.listen(port, () => console.log('Listening on port ${port}..'));