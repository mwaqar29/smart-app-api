const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors  = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
	client: 'pg',
	connection: {
		host : '127.0.0.1',
		user : 'postgres',
		password : 'root',
		database : 'smart-app'
	}
});

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req,res) => {
	db.select('*').from('users').then(data => {
		res.send(data);
	});
});
app.post('/signin', signin.handleSignin(db, bcrypt));
app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt));
app.get('/profile/:id', (req, res) => profile.handleProfileGet(req, res, db));
app.put('/image', (req, res) => image.handleImage(req, res, db));

app.listen(process.env.PORT || 3000, () => {
	console.log(`App Running Successfully on port ${process.env.PORT}`);
});

/*
/ --> res = this is working
/signin  --> POST = success/fail
/register --> POST = user
/profile/:userid --> GET = user
/image --> PUT = user
*/