// src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const multer = require('multer');
const path = require('path');

// Define storage for the images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../public/images'); // Assuming you have a 'public/images' folder to store images
    },
    filename: (req, file, cb) => {
        cb(null, 'product-' + Date.now() + path.extname(file.originalname));
    },
});

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Initialize upload
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },
});

// Admin-related routes
router.post('/products', upload.single('image'), (req, res) => {
    const { name, description, price } = req.body;
    const imageUrl = req.file ? `http://localhost:3000/images/${req.file.filename}` : null; // Save the image URL

    // Assuming you have validation for name, description, price, and imageUrl

    db.query('INSERT INTO Product (Name, Description, Price, ImageUrl) VALUES (?, ?, ?, ?)', [name, description, price, imageUrl], (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.status(201).json({ message: 'Product added successfully', productId: results.insertId });
        }
    });
});

router.put('/products/:productId', upload.single('image'), (req, res) => {
    const productId = req.params.productId;
    const { name, description, price } = req.body;
    const imageUrl = req.file ? `/images/${req.file.filename}` : null; // Save the new image URL

    // Assuming you have validation for name, description, price, and imageUrl

    db.query('UPDATE Product SET Name = ?, Description = ?, Price = ?, ImageUrl = ? WHERE ProductID = ?', [name, description, price, imageUrl, productId], (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).send('Internal Server Error');
        } else {
            if (results.affectedRows === 0) {
                res.status(404).json({ message: 'Product not found' });
            } else {
                res.json({ message: 'Product updated successfully' });
            }
        }
    });
});


router.delete('/products/:productId', (req, res) => {
    const productId = req.params.productId;

    // Delete associated order items first
    db.query('DELETE FROM OrderItem WHERE ProductID = ?', [productId], (err) => {
        if (err) {
            console.error('Error deleting order items:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        // Delete associated product
        db.query('DELETE FROM Product WHERE ProductID = ?', [productId], (err, results) => {
            if (err) {
                console.error('Error executing MySQL query:', err);
                res.status(500).send('Internal Server Error');
            } else {
                if (results.affectedRows === 0) {
                    res.status(404).json({ message: 'Product not found' });
                } else {
                    res.json({ message: 'Product deleted successfully' });
                }
            }
        });
    });
});

// Admin-only routes(Authorization and authentication required)
// router.get('/orders', (req, res) => {
//     db.query('SELECT * FROM `Order`', (err, results) => {
//         if (err) {
//             console.error('Error executing MySQL query:', err);
//             res.status(500).send('Internal Server Error');
//         } else {
//             res.json(results);
//         }
//     });
// });

// get All orders(Authorization and authentication required)
// router.get('/orders', (req, res) => {
//     // Retrieve all orders from the database (admin only)
//     db.query('SELECT * FROM `Order`', (err, results) => {
//         if (err) {
//             console.error('Error executing MySQL query:', err);
//             res.status(500).send('Internal Server Error');
//         } else {
//             res.json(results);
//         }
//     });
// });

// GET endpoint to retrieve orders with product information
router.get('/orders', (req, res) => {
    const selectQuery = `
      SELECT po.OrderId, po.ProductId, po.CustomerName, po.CustomerEmail, po.CustomerPhoneNumber, po.CustomerAddress,
             p.Name as ProductName
      FROM ProductOrder po
      LEFT JOIN product p ON po.ProductId = p.ProductID
    `;

    db.query(selectQuery, (err, results) => {
        if (err) {
            console.error('Error retrieving orders: ', err);
            res.status(500).send('Error retrieving orders');
            return;
        }

        // Map the results to include only necessary fields
        const orders = results.map((result) => ({
            OrderId: result.OrderId,
            ProductId: result.ProductId,
            CustomerName: result.CustomerName,
            CustomerEmail: result.CustomerEmail,
            CustomerPhoneNumber: result.CustomerPhoneNumber,
            CustomerAddress: result.CustomerAddress,
            ProductName: result.ProductName,
        }));

        res.status(200).json(orders);
    });
});

// Assuming you have a table named 'OrderItem' for storing order items
router.delete('/orders/:orderId', (req, res) => {
    const orderId = req.params.orderId;

    // Delete the order
    db.query('DELETE FROM ProductOrder WHERE OrderId = ?', [orderId], (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).send('Internal Server Error');
        } else {
            if (results.affectedRows === 0) {
                res.status(404).json({ message: 'Order not found' });
            } else {
                res.json({ message: 'Order deleted successfully' });
            }
        }
    });

});


module.exports = router;
