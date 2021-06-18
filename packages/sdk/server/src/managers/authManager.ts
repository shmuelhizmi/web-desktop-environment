import prompt from "readline-sync";
import { createHmac } from "crypto";
import { IncomingMessage, ServerResponse } from "http";
import { sign as signjwt, verify as verifyjwt } from "jsonwebtoken";

const getData = <Data>(req: IncomingMessage): Promise<Data> => {
	return new Promise<Data>((res, rej) => {
		let data = "";
		req.on("data", (chunk) => {
			data += chunk;
		});
		req.on("end", () => {
			try {
				res(JSON.parse(data));
			} catch (err) {
				rej(err);
			}
		});
	});
};

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
	authLogin = (req: IncomingMessage, res: ServerResponse) => {
		if (req.url === "/login") {
			if (req.method !== "POST") {
				res.writeHead(200, {
					Allow: "POST",
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Headers": "*",
				});
				res.end();
				return;
			}
			const success = (auth = true) => {
				res.writeHead(200, {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Headers": "*",
				});
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

					res.end(JSON.stringify({ success: auth, token }));
					return auth;
				}
				res.end(JSON.stringify({ success: auth }));
				return auth;
			};
			return getData<{ password: string }>(req)
				.then(({ password }) => {
					if (typeof password !== "string") {
						success(false);
						return false;
					}
					if (this.authPassword(password)) {
						success(true);
						return true;
					}
				})
				.catch(() => success(false));
		}
	};
}

export default AuthManager;
