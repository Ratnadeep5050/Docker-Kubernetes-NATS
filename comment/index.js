const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const axios = require('axios');
const { stat } = require('fs');

const app = express();

app.use(bodyParser.json());

const commentsByPostId = {};

app.get('/post/:id/comment', async (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/post/:id/comment', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] || [];

    comments.push({
        id: commentId,
        content,
        status: "pending"
    });

    commentsByPostId[req.params.id] = comments;

    await axios.post("http://event-bus-service:4002/event", {
        type: "CommentCreated",
        data: {
            id: commentId,
            content,
            postId: req.params.id,
            status: "pending"
        }
    });

    res.status(201).send(comments);
});

app.post("/event", async (req, res) => {
    console.log("Event received ", req.body.type);

    const { type, data } = req.body;

    if(type === 'CommentModerated') {
        const { id, postId, status, content } = data;

        const comments = commentsByPostId[postId];

        const comment = comments.find(comment => {
            return comment.id === id;
        })

        comment.status = status;

        console.log(status);
        await axios.post("http://event-bus-service:4002/event", {
            type: 'CommentUpdated',
            data: {
                id,
                postId,
                content,
                status
            }
        });
    }
    res.send({});
});

app.listen(4001, () => {
    console.log("Listening on 4001");
})