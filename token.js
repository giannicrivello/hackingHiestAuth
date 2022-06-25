import jwt from 'jsonwebtoken';

const JWT_SECRET = "{8367E87C-B794-4A04-89DD-15FE7FDBFF78}"
const JWT_REFRESH_SECRET = "{asdfasdfdsfa-B794-4A04-89DD-15FE7FDBFF78}"


export const createAccessToken = (userId) => {
	return jwt.sign({ userId}, JWT_SECRET, {
		expiresIn: '15m'

	})
}

export const createRefreshToken = (userId) => {
	return jwt.sign({ userId }, JWT_REFRESH_SECRET, {
		expiresIn: '7d'
	})
}

export const sendAccessToken = (res, req, accessToken) => {
	 res.setHeader("set-cookie", [`JWT_TOKEN=${accessToken}; httponly; samesite=lax`]);

}

export const sendRefreshToken = (res, req, refreshToken) => {
	res.send({"success": "Logged in successfully!", "refreshToken": refreshToken})

}


