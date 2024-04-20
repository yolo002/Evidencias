const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;
const secretKey = 'your_secret_key';

app.use(bodyParser.json());

// Simulación de una base de datos de usuarios
const users = [
  { id: 1, username: 'admin', password: 'admin' },
  { id: 2, username: 'Julio', password: 'Marquez' }
];

// Ruta protegida que utiliza el middleware
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Ruta protegida', user: req.user });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


// Ruta para el inicio de sesión
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Verificar credenciales
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }
  
  // Generar tokens
  const accessToken = jwt.sign({ username: user.username, id: user.id }, secretKey, { expiresIn: '1m' });
  const refreshToken = jwt.sign({ username: user.username, id: user.id }, secretKey);
  
  // Enviar tokens como respuesta
  res.json({ accessToken, refreshToken });
});

// Middleware para verificar el token de acceso
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Ruta protegida
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Ruta protegida', user: req.user });
});

// Ruta para la raíz de la aplicación
app.get('/', (req, res) => {
  // Redirigir al formulario de inicio de sesión
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

