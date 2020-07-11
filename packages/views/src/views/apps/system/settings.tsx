import SettingsInterface from "@web-desktop-environment/interfaces/lib/views/apps/system/Settings";
import {
  Settings as SettingsConfiguration,
  ThemeType,
} from "@web-desktop-environment/interfaces/lib/shared/settings";
import { ReflowReactComponent } from "@mcesystems/reflow-react-display-layer";
import * as React from "react";
import { withStyles, createStyles, WithStyles } from "@material-ui/styles";
import { Theme } from "../../../theme";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      background: theme.background.main,
      width: "100%",
      height: "100%",
      display: "flex",
    },
    categorySelection: {
      background: theme.background.dark,
      height: "100%",
      width: 250,
    },
    selectCategoryButton: {
      fontSize: 30,
      paddingTop: 5,
      paddingBottom: 5,
      userSelect: "none",
      cursor: "pointer",
      width: "100%",
      textAlign: "center",
      borderBottom: `solid 2px ${theme.primary.dark}`,
      color: theme.primary.text,
      "&:hover": {
        backdropFilter: "blur(3px)",
      },
    },
    selectCategoryButtonSelected: {
      background: `${theme.primary.main}`,
    },
    category: {
      width: "100%",
      height: "100%",
      background: theme.background.main,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    categoryTitle: {
      width: "90%",
      userSelect: "none",
      borderBottom: `solid 2px ${theme.primary.transparent}`,
      color: theme.primary.text,
      "-webkit-text-stroke": `1px ${theme.background.dark}`,
      fontSize: 50,
    },
    settingsBlock: {
      width: "80%",
      border: `2px solid ${theme.background.transparent}`,
      background: theme.background.dark,
      margin: 50,
      padding: 20,
    },
    settingsProperty: {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      fontSize: 30,
      color: theme.primary.text,
      minHeight: 45,
      borderBottom: `solid 2px ${theme.primary.main}`,
    },
    settingsPropertyName: {},
    settingsPropertyValue: {
      width: "60%",
      height: "100%",
      "& input": {
        color: theme.primary.text,
        width: "100%",
        height: "100%",
        border: "none",
        borderBottom: `solid 1px ${theme.primary.transparent}`,
        outline: "none",
        fontSize: 23,
        background: "transparent",
      },
    },
  });

type SettingsCategory = "desktop" | "network" | "systemInfo";

interface SettingsState {
  selectedCategory: SettingsCategory;
  settings: SettingsConfiguration;
}

class Settings extends ReflowReactComponent<
  SettingsInterface,
  WithStyles<typeof styles>,
  SettingsState
> {
  constructor(props: Settings["props"]) {
    super(props);
    this.state = {
      selectedCategory: "desktop",
      settings: props.settings,
    };
  }

  renderDesktopCategory = () => {
    const { classes, event } = this.props;
    return (
      <div className={classes.category}>
        <div className={classes.categoryTitle}>Desktop Settings</div>
        <div className={classes.settingsBlock}>
          <div className={classes.settingsProperty}>
            <div className={classes.settingsPropertyName}>background</div>
            <div className={classes.settingsPropertyValue}>
              <input
                type="text"
                value={this.state.settings.desktop.background}
                onChange={(e) => {
                  const value = e.target.value;
                  this.setState((state) => {
                    state.settings.desktop.background = value;
                    event("setSettings", state.settings);
                    return {
                      settings: state.settings,
                    };
                  });
                }}
              />
            </div>
          </div>
          <div className={classes.settingsProperty}>
            <div className={classes.settingsPropertyName}>theme</div>
            <div className={classes.settingsPropertyValue}>
              <select
                value={this.state.settings.desktop.theme}
                onChange={(e) => {
                  const value = e.target.value as ThemeType;
                  this.setState((state) => {
                    state.settings.desktop.theme = value;
                    event("setSettings", state.settings);
                    return {
                      settings: state.settings,
                    };
                  });
                }}
              >
                <option value="dark">dark</option>
                <option value="light">light</option>
                <option value="transparent">transparent</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { classes } = this.props;
    const { selectedCategory } = this.state;
    return (
      <div className={classes.root}>
        <div className={classes.categorySelection}>
          <div
            className={`${classes.selectCategoryButton} ${
              selectedCategory === "desktop"
                ? classes.selectCategoryButtonSelected
                : ""
            }`}
            onClick={() => this.setState({ selectedCategory: "desktop" })}
          >
            Desktop
          </div>
          <div
            className={`${classes.selectCategoryButton} ${
              selectedCategory === "network"
                ? classes.selectCategoryButtonSelected
                : ""
            }`}
            onClick={() => this.setState({ selectedCategory: "network" })}
          >
            Network
          </div>
          <div
            className={`${classes.selectCategoryButton} ${
              selectedCategory === "systemInfo"
                ? classes.selectCategoryButtonSelected
                : ""
            }`}
            onClick={() => this.setState({ selectedCategory: "systemInfo" })}
          >
            Information
          </div>
        </div>
        {selectedCategory === "desktop" && this.renderDesktopCategory()}
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Settings);
