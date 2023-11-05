const Dashboard = require('./controllers/Dashboard');
const UserApp = require('./controllers/UserApp');

const express = require('express');
const app = express();
const port = 3000;

app.use((req, res, next) => {
    const origin = req.get('origin');
    res.header('Access-Control-Allow-Origin', origin);
    next();
});

// Dashboard
app.get('/', Dashboard.getView);

// UserApp
app.get('/calendarEvents', UserApp.getCalendarEvent);
app.post('/calendarEvents', UserApp.setCalendarEvent);

app.listen(port, () => {
    console.log(`Servidor Express está ouvindo na porta ${port}`);
});