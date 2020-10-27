const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/post", (req, res) => {
    res.send(posts);
});

app.post("/event", (req, res) => {
    const { type, data } = req.body;

    if(type === 'PostCreated') {
        const { id, title } = data;

        posts[id] = { id, title, comment: [] };
    }

    if(type === 'CommentCreated') {
        const { id, content, postId } = data;

        const post = posts[postId];
        post.comment.push({
            id,
            content
        });
    }

    console.log(posts);
    res.send({});
});

app.listen(4003, () => {
    console.log("Listening on 4003");
});