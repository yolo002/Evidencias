// Middleware para verificar el token de acceso
function authenticateToken(req, res, next) {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(401).json({ message: 'Acceso no autorizado' });
  }

  jwt.verify(accessToken, secretKey, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        // Si el token de acceso ha caducado, intentar renovarlo
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
          return res.status(401).json({ message: 'Token de acceso caducado. Inicie sesión nuevamente.' });
        }

        // Verificar y decodificar el refresh token
        jwt.verify(refreshToken, secretKey, (err, decoded) => {
          if (err) {
            return res.status(403).json({ message: 'Token de actualización inválido.' });
          }

          // Generar un nuevo token de acceso
          const newAccessToken = jwt.sign({ username: decoded.username }, secretKey, { expiresIn: '30m' });
          
          // Actualizar la cookie de token de acceso
          res.cookie('accessToken', newAccessToken, { httpOnly: true });
          req.user = decoded;
          next();
        });
      } else {
        return res.status(403).json({ message: 'Token de acceso inválido.' });
      }
    } else {
      req.user = user;
      next();
    }
  });
}

// Ruta protegida que utiliza el middleware de verificación de token de acceso
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Ruta protegida', user: req.user });
});

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
  // Limpiar las cookies de tokens
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  // Redirigir al usuario a la página de inicio de sesión
  res.redirect('/login');
});

