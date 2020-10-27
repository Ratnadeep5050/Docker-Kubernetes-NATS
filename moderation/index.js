const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(bodyParser.json());

app.post('/event', async (req, res) => {
    const { type, data } = req.body;

    if(type === 'CommentCreated') {
        const status = data.content.includes('chul') ? 'rejected' : 'approved';
        console.log(status);
        await axios.post("http://localhost:4002/event", {
        type: 'CommentModerated',
        data: {
            id: data.id,
            postId: data.postId,
            content: data.content,
            status
        }
    });
    }
});

app.listen(4004, () => {
    console.log("Listening on 4004");
});
