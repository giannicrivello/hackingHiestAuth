import jwt from 'jsonwebtoken';

const JWT_SECRET = "{8367E87C-B794-4A04-89DD-15FE7FDBFF78}"
export const isAuth = (req) => {
	
	try {
	const authorization = req.headers['authorization'];
	if (!authorization) throw new Error("you need to log in");

	const token = authorization.split(' ')[1];
	const { userId } = jwt.verify(token, JWT_SECRET);

	return userId;
	} catch(err) {
		console.log(req)
	}


}
