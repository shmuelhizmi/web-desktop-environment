import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import Card from "@components/card";
import TextField from "@components/textField";
import Button from "@components/button";
import { Theme } from "@web-desktop-environment/interfaces/lib/shared/settings";
import { Link } from "react-router-dom";

interface LoginProps {
	onLogin: (host: string, port: number, useHttps: boolean) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		position: "fixed",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		height: "100%",
		background: 'url("https://picsum.photos/id/1039/1920/1080")',
	},
	card: {
		width: 500,
		height: 400,
		padding: "70px 60px",
		display: "flex",
		color: theme.background.text,
		flexDirection: "column",
		justifyContent: "space-between",
		backdropFilter: "blur(5px)",
		userSelect: "none",
	},
	barButtonsContainer: {
		position: "relative",
		top: 30,
		right: 20,
		width: 40,
		height: 20,
		display: "flex",
		justifyContent: "space-between",
	},
	"@media (max-width: 768px)": {
		card: {
			position: "absolute",
			top: 0,
			right: 0,
			left: 0,
			bottom: 0,
			padding: 0,
			borderRadius: 0,
			alignItems: "center",
			justifyContent: "center",
			width: "100%",
			"& *": {
				margin: 20,
				maxWidth: "90%",
			},
			height: "100%",
		},
		barButtonsContainer: {
			position: "absolute",
		},
	},
	barButton: {
		width: 15,
		height: 15,
		borderRadius: "50%",
		zIndex: 2,
		border: "1px solid #0004",
	},
	barButtonExit: {
		cursor: "pointer",
		background: theme.error.main,
		"&:hover": {
			background: theme.error.dark,
		},
	},
	flexEnd: {
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-end",
	},
	flex: {
		display: "flex",
	},
	barButtonCollapse: {
		cursor: "pointer",
		background: theme.success.main,
		"&:hover": {
			background: theme.success.dark,
		},
	},
	link: {
		textDecoration: "none",
	},
}));

const Login = (props: LoginProps) => {
	const classes = useStyles();
	const [host, setHost] = useState(
		window.localStorage.getItem("last-host") || "localhost"
	);
	const [port, setPort] = useState(
		Number(window.localStorage.getItem("last-port")) || 5000
	);
	const [https /* , setHttps */] = useState(false);
	useEffect(() => {
		window.localStorage.setItem("last-host", host);
		window.localStorage.setItem("last-port", String(port));
	}, [host, port]);
	return (
		<div className={classes.root}>
			<div className={classes.flexEnd}>
				<div className={classes.barButtonsContainer}>
					<div
						className={`${classes.barButton} ${classes.barButtonCollapse}`}
					/>
					<div className={`${classes.barButton} ${classes.barButtonExit}`} />
				</div>
				<Card className={classes.card}>
					<h2>Login to your server</h2>
					<TextField
						value={host}
						onChange={(newValue) => setHost(newValue || "")}
						placeholder="host"
					></TextField>
					<TextField
						value={String(port || "")}
						onChange={(newValue) => setPort(Number(newValue))}
						placeholder="port"
					></TextField>
					{/* <div className={classes.flex}>
						<input
							type="checkbox"
							checked={https}
							onChange={(e) => setHttps(e.target.checked)}
						/>
						<label>Use HTTPS</label>
					</div> */}
					<Button
						variant="main"
						onClick={() => props.onLogin(host, port, https)}
						color="background"
						border
					>
						Login
					</Button>
					<Link to="/demo" className={classes.link}>
						<Button variant="main" color="background" border>
							or instead you can visit the Demo
						</Button>
					</Link>
				</Card>
			</div>
		</div>
	);
};

export default Login;
