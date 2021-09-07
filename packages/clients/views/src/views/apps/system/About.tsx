import React from "react";
import { PureComponent } from "@components/pureComponent";
import AboutInterface from "@web-desktop-environment/interfaces/lib/views/apps/system/About";
import { withStyles, createStyles, WithStyles } from "@material-ui/styles";
import { Theme } from "@web-desktop-environment/interfaces/lib/shared/settings";
import Button from "@components/button";

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
			justifyContent: "center",
			alignItems: "center",
			borderRadius: "0 0 9px 9px",
			boxShadow: `-10px 12px 20px -2px  ${theme.shadowColor}`,
			backdropFilter: theme.type === "transparent" ? "blur(3px)" : "none",
		},
		image: {
			flex: 1,
			maxWidth: 150,
			margin: 10,
			border: "5px solid transparent",
			borderImage:
				"linear-gradient(to bottom right, #b827fc 0%, #2c90fc 25%, #b8fd33 50%, #fec837 75%, #fd1892 100%)",
			borderImageSlice: 1,
		},
		about: {
			margin: 10,
			flex: 2,
			color: theme.background.text,
			textAlign: "center",
		},
	});

class About extends PureComponent<
	AboutInterface,
	{},
	WithStyles<typeof styles>
> {
	render() {
		const { classes, image, info, onClose, title } = this.props;

		return (
			<div className={classes.root}>
				<img className={classes.image} draggable={false} src={image} />
				<div className={classes.about}>
					<b>{title}</b>
					{info.map((infoItem, index) => (
						<p key={index}>{infoItem}</p>
					))}
					<Button color="secondary" onClick={onClose}>
						Close
					</Button>
				</div>
			</div>
		);
	}
}

export default withStyles(styles)(About);
