const express = require('express');
const app = express();
const PORT = 3000;
const pageRoutes = require('./routes/page.routes'); // 1. Import Router

app.set('view engine', 'ejs');
app.use(express.static('public'));

// 2. Pasang router ke pipeline Express
app.use('/', pageRoutes);

app.use((req, res) => { res.status(404).send('404 Not Found'); });

app.listen(PORT, () => console.log(`[SERVER] Aktif di http://localhost:${PORT}`));