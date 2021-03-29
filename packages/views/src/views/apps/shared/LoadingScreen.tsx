import React from "react";
import { Component } from "@react-fullstack/fullstack";
import LoadingScreenInterface from "@web-desktop-environment/interfaces/lib/views/apps/shared/LoadingScreen";
import { Theme } from "@web-desktop-environment/interfaces/lib/shared/settings";
import { WithStyles, withStyles, createStyles } from "@material-ui/styles";

const styles = (theme: Theme) =>
	createStyles({
		root: {
			background: theme.background.main,
			border: theme.windowBorder
				? `1px solid ${theme.windowBorderColor}`
				: "none",
			width: "100%",
			height: "100%",
			display: "flex",
			flexDirection: "column",
			gap: 20,
			justifyContent: "center",
			alignItems: "center",
			borderRadius: "0 0 9px 9px",
			boxShadow: `-10px 12px 20px -2px  ${theme.shadowColor}`,
			backdropFilter: theme.type === "transparent" ? "blur(3px)" : "none",
		},
		animationWave: {
			width: "15%",
			padding: "15%",
			boxSizing: "border-box",
			backgroundColor: theme.secondary.main,
			borderRadius: "20% 20% 10% 10%",
			position: "relative",
			boxShadow: `inset 0 0 30px 0 ${theme.shadowColor}, 0 4px 10px 0 ${theme.shadowColor}`,
			overflow: "hidden",
			"&:before": {
				content: "''",
				position: "absolute",
				width: "120%",
				height: "110%",
				top: "-75%",
				right: "-10%",
				borderRadius: "50%",
				background: theme.background.main,
				animation: "$wave 5s linear infinite",
			},
			"&:after": {
				content: "''",
				position: "absolute",
				width: "120%",
				right: "-10%",
				height: "107%",
				top: "-75%",
				borderRadius: "50%",
				background: theme.background.light,
				animation: "$wave 5s linear infinite",
			},
		},
		"@keyframes wave": {
			from: {
				transform: "rotate(0)",
			},
			to: {
				transform: "rotate(360deg)",
			},
		},
		jumpingCube: {
			width: 50,
			height: 50,
			position: "relative",
			top: -10,
			"&:before": {
				content: "''",
				width: 50,
				height: 5,
				background: theme.primary.dark,
				opacity: 0.1,
				position: "absolute",
				top: 59,
				left: 0,
				borderRadius: "50%",
				animation: "$shadowStretch .5s linear infinite",
			},
			"&:after": {
				content: "''",
				width: 50,
				height: 50,
				border: `1px solid ${theme.windowBorderColor}`,
				background: theme.primary.main,
				position: "absolute",
				top: 0,
				left: 0,
				borderRadius: 9,
				animation: "$boxJump .5s linear infinite",
			},
		},
		"@keyframes boxJump": {
			"17%": {
				borderBottomRightRadius: 3,
			},
			"25%": {
				transform: "translateY(9px) rotate(22.5deg)",
			},
			"50%": {
				transform: "translateY(18px) scale(1, .9) rotate(45deg)",
				borderBottomRightRadius: 40,
			},
			"75%": {
				transform: "translateY(9px) rotate(67.5deg)",
			},
			"100%": {
				transform: " translateY(0) rotate(90deg)",
			},
		},
		"@keyframes shadow": {
			"0%, 100%": {
				transform: "scale(1, 1)",
			},
			"50%": {
				transform: "scale(1.2, 1)",
			},
		},
		message: {
			fontSize: 30,
			color: theme.background.text,
		},
	});

class LoadingScreen extends Component<
	LoadingScreenInterface,
	{},
	WithStyles<typeof styles>
> {
	render() {
		const { classes, message, variant } = this.props;
		return (
			<div className={classes.root}>
				<div
					className={
						variant === "water" ? classes.animationWave : classes.jumpingCube
					}
				/>
				<div className={classes.message}>{message}</div>
			</div>
		);
	}
}

export default withStyles(styles)(LoadingScreen);
