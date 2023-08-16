const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000; 
const { Stripe } = require('stripe');
const { Router } = require('express');
const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Crear un pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER_DATABASE,
  password: process.env.DB_PASSWORD_DATABASE,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

app.use(express.static(path.join(__dirname, 'public')));
app.get('/index.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'index.js'));
});
app.get('./public/codigo.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, './public/codigo.js'));
});
app.get('./public/menu.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, './public/menu.js'));
});
app.get('./public/carrito.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, './public/carrito.js'));
});
// Configuración de la conexión a la base de datos
app.get('/productos', async (req, res) => {
  try {
    const connection = await pool.getConnection(); // Obtener una conexión del pool
    const [rows, fields] = await connection.execute('SELECT * FROM productos');
    connection.release(); // Liberar la conexión para volver al pool
    res.json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'An error occurred while fetching products.' });
  }
});




const createSession = async (req, res) =>{
  const { cartItems } = req.body;

  const lineItems = cartItems.map(item => {
    return {
        price_data: {
            product_data: {
                name: item.titulo,
                description: item.categoria_nombre
            },
            currency: "usd",
            unit_amount: item.precio * 100
        },
        quantity: 1
    };
});
  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode:"payment",
    success_url: "https://ecommerce-lake-one.vercel.app/?success=true",
    cancel_url: "https://ecommerce-lake-one.vercel.app/cancel"
  })
  return res.json(session)
}

router.post("/create-checkout-session",express.json(), createSession)
router.get("/success", (req, res) => res.redirect("/index.html"))
router.get("/cancel", (req, res) => res.redirect("/carrito.html"))

app.use("/", router);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});

