const app = require('./app');

const port_number=5000;

app.listen(port_number,()=>{
    console.log(`Server is up and running on the port ${port_number}`);
})