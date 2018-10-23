const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Todo = require('./models/Todo');

const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://Oliver:abc123@ds133533.mlab.com:33533/todolist?authMechanism=SCRAM-SHA-1');
const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database connection established successfully!');
});

router.route('/todo').get((req, res) => {
    Todo.find((err, todos) => {
        if (err)
            console.log(err);
        else
            res.json(todos);
    });
});

router.route('/todo/:id').get((req, res) => {
    Todo.findById(req.params.id, (err, todo) => {
        if (err)
            console.log(err);
        else
            res.json(todo);
    });
});

router.route('/todo/add').post((req, res) => {
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({'todo': 'Added successfully'});
        })
        .catch(err => {
            res.status(400).send('Failed to create new TODO');
        });
});

router.route('/todo/update/:id').post((req, res) => {
    Todo.findById(req.params.id, (err, todo) => {
        if (!todo)
            return next(new Error('Could not load document'));
        else {
            todo.completed = req.body.completed;
            todo.title = req.body.title;


            todo.save().then(todo => {
                res.json('Update done');
            }).catch(err => {
                res.status(400).send('Update failed');
            });
        }
    });
});

router.route('/todo/delete/:id').get((req, res) => {
    Todo.findByIdAndRemove({_id: req.params.id}, (err, todo) => {
        if (err)
            res.json(err);
        else
            res.json('Remove successfully');
    })
});

app.use('/', router);

app.listen(process.env.PORT || 8080, () => console.log('Express server running on port 8080'));