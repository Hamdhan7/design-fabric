// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/database');


// Get all products with image URLs
router.get('/products', (req, res) => {
    db.query('SELECT ProductID, Name, Description, Price, ImageURL FROM Product', (err, results) => {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(results);
    });
});

// Place orders (Authentication and authorization required for this )
// router.post('/orders', (req, res) => {
//     const { userId, products } = req.body;

//     // Validate userId and products (you may want to check if the user exists, and if products are valid)
//     if (!userId || !products || !Array.isArray(products) || products.length === 0) {
//         return res.status(400).json({ message: 'Invalid request data' });
//     }

//     // Start a database transaction (optional but recommended for atomicity)
//     db.beginTransaction((err) => {
//         if (err) {
//             console.error('Error starting transaction:', err);
//             return res.status(500).json({ message: 'Internal Server Error' });
//         }

//         // Insert order into the Order table
//         db.query('INSERT INTO `Order` (UserID) VALUES (?)', [userId], (err, result) => {
//             if (err) {
//                 return db.rollback(() => {
//                     console.error('Error inserting order into `Order` table:', err);
//                     res.status(500).json({ message: 'Internal Server Error' });
//                 });
//             }

//             const orderId = result.insertId;

//             // Insert order items into the OrderItem table
//             const orderItemValues = products.map(({ productId, quantity }) => [orderId, productId, quantity]);
//             db.query('INSERT INTO OrderItem (OrderID, ProductID, Quantity) VALUES ?', [orderItemValues], (err) => {
//                 if (err) {
//                     return db.rollback(() => {
//                         console.error('Error inserting order items into OrderItem table:', err);
//                         res.status(500).json({ message: 'Internal Server Error' });
//                     });
//                 }

//                 // Commit the transaction
//                 db.commit((err) => {
//                     if (err) {
//                         return db.rollback(() => {
//                             console.error('Error committing transaction:', err);
//                             res.status(500).json({ message: 'Internal Server Error' });
//                         });
//                     }

//                     res.status(201).json({ message: 'Order placed successfully', orderId });
//                 });
//             });
//         });
//     });
// });

// Get All the orders Placed by a user (Authentication and authorization required for this )
// router.get('/orders/user/:userId', (req, res) => {
//     const userId = req.params.userId;

//     // Validate userId
//     if (!userId) {
//         return res.status(400).json({ message: 'Invalid user ID' });
//     }

//     // Query the database to get orders for the specified user
//     db.query('SELECT * FROM `Order` WHERE UserID = ?', [userId], (err, results) => {
//         if (err) {
//             console.error('Error executing MySQL query:', err);
//             res.status(500).send('Internal Server Error');
//         } else {
//             res.json(results);
//         }
//     });
// });

// POST endpoint to create a new order
router.post('/orders', (req, res) => {
    const { ProductId, CustomerName, CustomerEmail, CustomerPhoneNumber, CustomerAddress } = req.body;
  
    const insertQuery = `
      INSERT INTO ProductOrder (ProductId, CustomerName, CustomerEmail, CustomerPhoneNumber, CustomerAddress)
      VALUES (?, ?, ?, ?, ?)
    `;
  
    db.query(insertQuery, [ProductId, CustomerName, CustomerEmail, CustomerPhoneNumber, CustomerAddress], (err, results) => {
      if (err) {
        console.error('Error creating order: ', err);
        res.status(500).send('Error creating order');
        return;
      }
      res.status(201).send('Order created successfully');
    });
  });

module.exports = router;
