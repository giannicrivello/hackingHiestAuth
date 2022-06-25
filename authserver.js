import crypto from 'crypto';
import Express from 'express';
import {hash, compare} from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser';
import fs from 'fs'
import { fakeDB } from './fakeDB.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { createAccessToken, createRefreshToken, sendRefreshToken, sendAccessToken } from './token.js';
import { isAuth } from './isAuth.js';
const JWT_SECRET = "{8367E87C-B794-4A04-89DD-15FE7FDBFF78}"
const _dirname = dirname(fileURLToPath(import.meta.url));
//bad idea

const port = process.env.PORT || 8080;
const app = new Express();
app.use(Express.json());
app.use(cookieParser());
app.get('/', async(req, res) => {
	const token = req.cookies.JWT_TOKEN;
	console.log(token);
	if(token) {
		//found a token
		const user = await isAuth(token, JWT_SECRET);
		let userHtml = fs.readFileSync(_dirname + "/user.html","utf8")
		res.setHeader("content-type", ["text/html"])
		res.send(userHtml)
	}
	else {
		res.sendFile(_dirname + "/login.html");
	}

})


app.post('/register', async(req, res) => {
	const { email, password } = req.body;
	
	try {
		const user = fakeDB.find(usr => usr.email == email);
		if(user) throw new Error('User already exists');
		const hashedPassword = await hash(password, 10);
		fakeDB.push({
			id: fakeDB.length,
			email,
			password: hashedPassword,
		})
		console.log(fakeDB)
		res.send({ message: 'User Created' })
	} catch(err) {
		console.log(err);
	}
})
app.post('/login', async( req, res) => {
	const { email, password } = req.body;

	try {
		const user = fakeDB.find(usr => usr.email === email);
		if(!user) throw new Error("user does not exist");
		const valid = await compare(password, user.password)
		if(!valid) throw new Error("Password not correct");
		const accessToken = createAccessToken(user.id); 
		const refreshToken = createRefreshToken(user.id);
		user.refreshToken = refreshToken;
		console.log(fakeDB)
		sendAccessToken(res,req, accessToken);
		sendRefreshToken(res, refreshToken);


	}catch(err){
		console.error(err)
	}
})

app.post('/logout', (res, req) => {
	res.clearCookie('refreshToken');
	return res.send({
		message: 'logged out'
	})

})

app.post('/protected', async(req, res) => {
	try {
		const userId = isAuth(req);

		if(userId !== null) {
			res.send({
				data: "this is protected data"
			})
		}

	} catch(err) {
		console.log(err);
	}

})

app.listen(port, () => {
	console.log(`listening on port ${port}`)

})






























