import SettingsInterface from "@web-desktop-environment/interfaces/lib/views/apps/system/Settings";
import {
  Settings as SettingsConfiguration,
  ThemeType,
} from "@web-desktop-environment/interfaces/lib/shared/settings";
import { ReflowReactComponent } from "@mcesystems/reflow-react-display-layer";
import * as React from "react";
import { withStyles, createStyles, WithStyles } from "@material-ui/styles";
import { Theme } from "../../../theme";
import StateComponent from "../../../components/stateComponent";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      background: theme.background.main,
      width: "100%",
      height: "calc(100% + 15px)",
      display: "flex",
      borderRadius: "0 0 15px 15px",
      boxShadow: theme.windowShadow,
    },
    categorySelection: {
      background: theme.background.dark,
      backdropFilter: theme.type === "transparent" ? "blur(6px)" : "none",
      borderRadius: "0 0 0 15px",
      height: "100%",
      width: 250,
    },
    selectCategoryButton: {
      fontSize: 24,
      paddingTop: 5,
      paddingBottom: 5,
      userSelect: "none",
      cursor: "pointer",
      width: "100%",
      textAlign: "center",
      borderBottom: `dashed 1px ${theme.primary.dark}`,
      color: theme.secondary.text,
      "&:hover":
        theme.type === "transparent"
          ? {
              backdropFilter: "blur(3px)",
            }
          : {
              background: theme.secondary.light,
            },
    },
    selectCategoryButtonSelected: {
      background: `${theme.secondary.main} !important`,
    },
    category: {
      width: "100%",
      maxHeight: "100%",
      overflowY: "auto",
      background: theme.background.main,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      borderRadius: "0 0 15px 0",
    },
    categoryTitle: {
      width: "90%",
      userSelect: "none",
      borderBottom: `solid 2px ${theme.background.transparent}`,
      color: theme.background.text,
      fontSize: 40,
    },
    categorySubtitle: {
      width: "85%",
      margin: 9,
      userSelect: "none",
      borderBottom: `solid 1px ${theme.background.transparent}`,
      color: theme.background.text,
      fontSize: 25,
    },
    marginBlock: {
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      marginTop: 30,
      marginBottom: 10,
    },
    settingsBlock: {
      width: "80%",
      border: `2px solid ${theme.background.transparent}`,
      background: theme.background.dark,
      padding: 20,
      borderRadius: 9,
    },
    settingsProperty: {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "1.3vw",
      color: theme.background.darkText || theme.background.text,
      minHeight: 45,
      marginBottom: 5,
      borderBottom: `solid 1px ${theme.background.main}`,
    },
    settingsPropertyName: {},
    settingsPropertyValue: {
      wordBreak: "break-all",
      width: "50%",
      height: "100%",
      background: "transparent",
      textAlign: "center",
      "& input": {
        textAlign: "center",
        color: theme.background.darkText || theme.background.text,
        width: "100%",
        height: "100%",
        border: "none",
        borderBottom: `solid 1px ${theme.primary.transparent}`,
        outline: "none",
        fontSize: 23,
        background: "transparent",
      },
      "& select": {
        textAlign: "center",
        color: theme.background.darkText || theme.background.text,
        width: "100%",
        height: "100%",
        border: "none",
        borderBottom: `solid 1px ${theme.primary.transparent}`,
        outline: "none",
        fontSize: 23,
        background: "transparent",
        "& option": {
          textAlign: "center",
          background: theme.background.dark,
        },
      },
    },
    settingsPropertyValueError: {
      fontSize: 12,
      color: theme.error.main,
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
        <div className={classes.marginBlock}>
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
      </div>
    );
  };

  renderNetworkCategory = () => {
    const { classes, event } = this.props;
    return (
      <StateComponent
        defaultState={{
          errorMainPort: "",
          errorStartPort: "",
          errorEndPort: "",
          mainPort: this.state.settings.network.ports.mainPort,
          startPort: this.state.settings.network.ports.startPort,
          endPort: this.state.settings.network.ports.endPort,
        }}
      >
        {(state, setState) => (
          <div className={classes.category}>
            <div className={classes.categoryTitle}>Network Settings</div>
            <div className={classes.marginBlock}>
              <div className={classes.settingsBlock}>
                <div className={classes.settingsProperty}>
                  <div className={classes.settingsPropertyName}>Main Port</div>
                  <div className={classes.settingsPropertyValue}>
                    <input
                      type="number"
                      value={state.mainPort || ""}
                      onChange={(e) => {
                        const value = Number(e.target.value) || 0;
                        setState({ mainPort: value });
                        if (value >= 1025 && value <= 65534) {
                          setState({ errorMainPort: "" });
                          this.setState((state) => {
                            state.settings.network.ports.mainPort = value;
                            event("setSettings", state.settings);
                            return {
                              settings: state.settings,
                            };
                          });
                        } else {
                          setState({
                            errorMainPort:
                              "please enter a number between 1025 to 65,534",
                          });
                        }
                      }}
                    />
                    <div className={classes.settingsPropertyValueError}>
                      {state.errorMainPort}
                    </div>
                  </div>
                </div>
                <div className={classes.settingsProperty}>
                  <div className={classes.settingsPropertyName}>Start Port</div>
                  <div className={classes.settingsPropertyValue}>
                    <input
                      type="number"
                      value={state.startPort || ""}
                      onChange={(e) => {
                        const value = Number(e.target.value) || 0;
                        setState({ startPort: value });
                        if (value >= 1025 && value <= 65534) {
                          setState({ errorStartPort: "" });
                          this.setState((state) => {
                            state.settings.network.ports.startPort = value;
                            event("setSettings", state.settings);
                            return {
                              settings: state.settings,
                            };
                          });
                        } else {
                          setState({
                            errorStartPort:
                              "please enter a number between 1025 to 65,534",
                          });
                        }
                      }}
                    />
                    <div className={classes.settingsPropertyValueError}>
                      {state.errorMainPort}
                    </div>
                  </div>
                </div>
                <div className={classes.settingsProperty}>
                  <div className={classes.settingsPropertyName}>End Port</div>
                  <div className={classes.settingsPropertyValue}>
                    <input
                      type="number"
                      value={state.endPort || ""}
                      onChange={(e) => {
                        const value = Number(e.target.value) || 0;
                        setState({ endPort: value });
                        if (value >= 1025 && value <= 65534) {
                          setState({ errorEndPort: "" });
                          this.setState((state) => {
                            state.settings.network.ports.endPort = value;
                            event("setSettings", state.settings);
                            return {
                              settings: state.settings,
                            };
                          });
                        } else {
                          setState({
                            errorEndPort:
                              "please enter a number between 1025 to 65,534",
                          });
                        }
                      }}
                    />
                    <div className={classes.settingsPropertyValueError}>
                      {state.errorMainPort}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </StateComponent>
    );
  };

  renderSystemInfoCategory = () => {
    const { classes, systemInfo } = this.props;
    return (
      <div className={classes.category}>
        <div className={classes.categoryTitle}>System Information</div>
        {systemInfo?.os && (
          <div className={classes.marginBlock}>
            <div className={classes.categorySubtitle}>OS</div>
            <div className={classes.settingsBlock}>
              {systemInfo.os.hostname && (
                <div className={classes.settingsProperty}>
                  <div className={classes.settingsPropertyName}>
                    computer hostname
                  </div>
                  <div className={classes.settingsPropertyValue}>
                    {systemInfo.os.hostname}
                  </div>
                </div>
              )}
              {systemInfo.os.platform && (
                <div className={classes.settingsProperty}>
                  <div className={classes.settingsPropertyName}>running os</div>
                  <div className={classes.settingsPropertyValue}>
                    {systemInfo.os.platform}
                  </div>
                </div>
              )}
              {systemInfo.os.kernel && (
                <div className={classes.settingsProperty}>
                  <div className={classes.settingsPropertyName}>
                    running kernel
                  </div>
                  <div className={classes.settingsPropertyValue}>
                    {systemInfo.os.kernel}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {systemInfo?.cpu && (
          <div className={classes.marginBlock}>
            <div className={classes.categorySubtitle}>CPU</div>
            <div className={classes.settingsBlock}>
              {systemInfo.cpu?.brandName && (
                <div className={classes.settingsProperty}>
                  <div className={classes.settingsPropertyName}>name</div>
                  <div className={classes.settingsPropertyValue}>
                    {systemInfo.cpu.brandName}
                  </div>
                </div>
              )}
              {systemInfo.cpu?.manufacturer && (
                <div className={classes.settingsProperty}>
                  <div className={classes.settingsPropertyName}>
                    manufacturer name
                  </div>
                  <div className={classes.settingsPropertyValue}>
                    {systemInfo.cpu.manufacturer}
                  </div>
                </div>
              )}
              {systemInfo.cpu?.cores && (
                <div className={classes.settingsProperty}>
                  <div className={classes.settingsPropertyName}>
                    number of cores
                  </div>
                  <div className={classes.settingsPropertyValue}>
                    {systemInfo.cpu.cores}
                  </div>
                </div>
              )}
              {systemInfo.cpu?.physicalCores && (
                <div className={classes.settingsProperty}>
                  <div className={classes.settingsPropertyName}>
                    number of physical cores
                  </div>
                  <div className={classes.settingsPropertyValue}>
                    {systemInfo.cpu.physicalCores}
                  </div>
                </div>
              )}
              {systemInfo.cpu?.speed && (
                <div className={classes.settingsProperty}>
                  <div className={classes.settingsPropertyName}>
                    prcessor speed
                  </div>
                  <div className={classes.settingsPropertyValue}>
                    {systemInfo.cpu.speed} GHz
                  </div>
                </div>
              )}
              {systemInfo.cpu?.speedMax && (
                <div className={classes.settingsProperty}>
                  <div className={classes.settingsPropertyName}>
                    prcessor maximum speed
                  </div>
                  <div className={classes.settingsPropertyValue}>
                    {systemInfo.cpu.speedMax} GHz
                  </div>
                </div>
              )}
              {systemInfo.cpu?.speedMin && (
                <div className={classes.settingsProperty}>
                  <div className={classes.settingsPropertyName}>
                    prcessor minimum speed
                  </div>
                  <div className={classes.settingsPropertyValue}>
                    {systemInfo.cpu.speedMin} GHz
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {systemInfo?.ram && (
          <div className={classes.marginBlock}>
            <div className={classes.categorySubtitle}>Memory</div>
            <div className={classes.settingsBlock}>
              {systemInfo.ram.total && (
                <div className={classes.settingsProperty}>
                  <div className={classes.settingsPropertyName}>
                    total memory amout
                  </div>
                  <div className={classes.settingsPropertyValue}>
                    {systemInfo.ram.total}
                  </div>
                </div>
              )}
              {systemInfo.ram.free && (
                <div className={classes.settingsProperty}>
                  <div className={classes.settingsPropertyName}>
                    free memory amout
                  </div>
                  <div className={classes.settingsPropertyValue}>
                    {systemInfo.ram.free}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {systemInfo?.disks &&
          systemInfo.disks.map(
            (disk, index) =>
              disk && (
                <div className={classes.marginBlock} key={index}>
                  <div className={classes.categorySubtitle}>
                    Disk {index + 1}
                  </div>
                  <div className={classes.settingsBlock}>
                    <div className={classes.settingsProperty}>
                      <div className={classes.settingsPropertyName}>
                        disk name
                      </div>
                      <div className={classes.settingsPropertyValue}>
                        {disk.name}
                      </div>
                    </div>
                    <div className={classes.settingsProperty}>
                      <div className={classes.settingsPropertyName}>
                        disk vendor
                      </div>
                      <div className={classes.settingsPropertyValue}>
                        {disk.vendor}
                      </div>
                    </div>
                    <div className={classes.settingsProperty}>
                      <div className={classes.settingsPropertyName}>
                        disk size
                      </div>
                      <div className={classes.settingsPropertyValue}>
                        {disk.total}
                      </div>
                    </div>
                  </div>
                </div>
              )
          )}
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
        {selectedCategory === "network" && this.renderNetworkCategory()}
        {selectedCategory === "systemInfo" && this.renderSystemInfoCategory()}
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Settings);
