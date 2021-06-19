import prompt from "readline-sync";
import { createHmac } from "crypto";
import { sign as signjwt, verify as verifyjwt } from "jsonwebtoken";
import { Request, Response } from "express";

const tokenDaysLifetime = 5;

class AuthManager {
	secret: string;
	constructor() {
		const password = prompt.question("desktop password> ");
		this.secret = createHmac("sha256", password).digest("base64");
	}
	authPassword = (password: string) => {
		return createHmac("sha256", password).digest("base64") === this.secret;
	};
	authReq = (token: string) => {
		try {
			token = decodeURIComponent(token);
			const { exp } = verifyjwt(decodeURIComponent(token), this.secret) as {
				ip: string;
				exp: number;
			};
			if (exp * 1000 > Date.now()) {
				return true;
			}
		} catch (err) {
			/* empty */
		}
		return false;
	};
	authLogin = (req: Request, res: Response) => {
		const success = (auth = true) => {
			if (auth) {
				const token = encodeURIComponent(
					signjwt(
						{
							exp:
								Math.floor(Date.now() / 1000) +
								60 * 60 * 24 * tokenDaysLifetime,
						},
						this.secret
					)
				);

				res.send({
					success: auth,
					token,
				});
				return auth;
			}
			res.send({ success: auth });
			return auth;
		};
		const { password } = req.body;
		if (typeof password !== "string") {
			success(false);
			return false;
		}
		if (this.authPassword(password)) {
			success(true);
			return true;
		}
	};
}

export default AuthManager;
