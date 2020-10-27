const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const events = [];

app.get('/event', (req, res) => {
    res.send(events);
});

app.post('/event', (req, res) => {
    const event = req.body;

    events.push(event);

    axios.post("http://localhost:4000/event", event);
    axios.post("http://localhost:4001/event", event);
    axios.post("http://localhost:4003/event", event);
    axios.post("http://localhost:4004/event", event);

    res.send({
        status: "OK"
    });
});

app.listen(4002, () => {
    console.log("Listening on 4002");
});
