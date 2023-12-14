


const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',        // Your MySQL username
    password: 'Uma@2023', // Your MySQL password
    database: 'DesignFabric', // Your database name
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

module.exports = connection;
