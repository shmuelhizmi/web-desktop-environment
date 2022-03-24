import Logger from "../utils/logger";
import DesktopManager from "../managers/desktopManager";
import { randomBytes } from "crypto";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import color from "chalk";
import figlet from "figlet";

interface Payload {
	ip: string;
	exp: number;
}

function oneWayStore() {
	const store = new Map<string, string>();
	return {
		set(value: string) {
			const uid = uuid();
			store.set(uid, value);
			return uid;
		},
		get(uid: string) {
			return store.get(uid);
		},
	};
}

export default class AuthManager {
	private logger: Logger;
	private desktopManager: DesktopManager;
	private tokensStore = oneWayStore();
	constructor(parentLogger: Logger, desktopManger: DesktopManager) {
		this.logger = parentLogger.mount("auth-manager");
		this.desktopManager = desktopManger;
		this.logger.info(
			color.bgWhite(
				color.blue`session code for web access in ${color.bold(
					color.green(this.seassionCode)
				)} use it to log-in`
			)
		);
		this.logger.direct(
			figlet.textSync("code - " + this.seassionCode, "Banner3")
		);
		this.logger.info(
			`token for local access is ${this.createAccessToken(
				"::1",
				60 * 60 * 24 * 7
			)}`
		);
	}
	tokenSecretKey = randomBytes(32).toString("hex");
	seassionCode = randomBytes(4).toString("hex");
	createAccessToken(ip: string, expiresIn: number): string {
		const payload: Payload = {
			ip,
			exp: Math.floor(Date.now() / 1000) + expiresIn,
		};
		this.logger.info(`Creating access token for ${ip}`);
		return this.tokensStore.set(jwt.sign(payload, this.tokenSecretKey));
	}
	verifyAccessToken(uuid: string, ip: string): boolean {
		const token = this.tokensStore.get(uuid);
		try {
			const payload: Payload = jwt.verify(
				token,
				this.tokenSecretKey
			) as Payload;
			if (payload.ip !== ip) {
				this.logger.warn(`Access token for ${payload.ip} does not match ${ip}`);
				return false;
			}
			return payload.exp > Math.floor(Date.now() / 1000);
		} catch (e) {
			return false;
		}
	}
	authenticate(ip: string, sessionCode: string) {
		if (sessionCode !== this.seassionCode) {
			this.logger.warn(
				`Session code ${sessionCode} does not match ${this.seassionCode}`
			);
			return false;
		}
		this.logger.info(`Authenticating ${ip}`);
		return this.createAccessToken(ip, 60 * 60 * 24);
	}
}
