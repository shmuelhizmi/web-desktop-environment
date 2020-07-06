import ExplorerInterface, {
  File,
} from "@web-desktop-environment/interfaces/lib/views/apps/utils/Explorer";
import { ReflowReactComponent } from "@mcesystems/reflow-react-display-layer";
import * as React from "react";
import { withStyles, createStyles, WithStyles } from "@material-ui/styles";
import { Theme } from "../../../theme";
import { Icon, Button } from "@fluentui/react";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      height: "100%",
      border: "none",
      borderRadius: "0 0 15px 15px",
      background: "rgba(191, 191, 191, 0.2)",
      paddingBottom: 15,
      backdropFilter: "blur(15px)",
    },
    locationBarContainer: {
      height: 50,
      width: "100%",
      justifyContent: "center",
      display: "flex",
    },
    locationBar: {
      boxShadow: "-1px 2px 20px 1px #0007",
      borderBottom: "1px solid #333",
      backdropFilter: "blur(20px)",
      marginTop: 10,
      width: "90%",
      maxHeight: "100%",
      borderRadius: 10,
      overflowX: "auto",
    },
    breadcrumbFilesContainer: {
      maxHeight: "100%",
      display: "flex",
      alignItems: "flex-end",
      width: "max-content",
    },
    fileBoxContainer: {
      height: "100%",
      width: "100%",
      display: "flex",
      justifyContent: "center",
    },
    fileBox: {
      margin: 15,
      boxShadow: "#000000 0px 0px 20px -6px inset",
      border: "#666 1px solid",
      borderRadius: 7,
      width: "100%",
      height: "90%",
      overflowY: "auto",
    },
    fileContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(6,1fr)",
      margin: 15,
      gridGap: 10,
      gridAutoRows: 100,
    },
    file: {
      borderBottom: "1px solid #333",
      borderRadius: 7,
      color: "#fff",
      fontFamily: "cursive",
      cursor: "pointer",
      boxShadow: "-1px 2px 20px 1px #0007",
      "&:hover": { background: "#1112" },
      height: 90,
      display: "flex",
      flexDirection: "column-reverse",
    },
    fileName: {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: 100,
      textAlign: "center",
      userSelect: "none",
    },
    fileIcon: {
      userSelect: "none",
      textAlign: "center",
      maxWidth: 100,
      fontSize: 50,
    },
    fileBreadcrumb: {
      width: "100%",
    },
    breadcrumbButtonItem: {
      height: "100%",
      minWidth: 20,
      textAlign: "center",
      userSelect: "none",
      fontFamily: "cursive",
      color: "#fff",
      fontSize: 25,
      "&:hover": {
        backgroundColor: "#0002",
      },
    },
    confirmDialog: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
      flexDirection: "column",
    },
    confirmDialogMessage: {
      maxWidth: "80%",
      fontFamily: "cursive",
      textAlign: "center",
      color: "#fff",
      fontSize: 25,
    },
    confirmDialogButtons: {
      margin: 20,
      width: "50%",
      display: "flex",
      justifyContent: "center",
    },
    confirmDialogButton: {
      margin: 10,
      fontSize: 50,
      width: "fit-content",
      height: "fit-content",
      borderRadius: 7,
      background: "#fff2",
      "&:hover": {
        background: "#fff5",
      },
    },
    confirmDialogButtonPrimary: {
      background: "rgba(0, 120, 212, 0.7)",
      "&:hover": {
        background: "rgba(0, 120, 212, 0.9)",
      },
    },
  });

interface ExplorerState {
  fileIsOverFile?: number;
  confirm?: {
    message: string;
    result?: boolean;
  };
}

// using ReflowReactComponent in this case provides the event() and done() callbacks.
class Explorer extends ReflowReactComponent<
  ExplorerInterface,
  WithStyles<typeof styles>,
  ExplorerState
> {
  dragedFile?: File;
  dropedFolder?: File;
  constructor(props: Explorer["props"]) {
    super(props);
    this.state = {};
  }

  getBreadcrumbLocations = (): { path: string; onClick: () => void }[] => {
    const { currentPath, platfromPathSperator, event } = this.props;
    let currentLocation = "";
    const pathArray: string[] = [];
    currentPath
      .split(platfromPathSperator)
      .filter((path) => path)
      .forEach((path) => pathArray.push(`${path}${platfromPathSperator}`));
    pathArray.unshift(platfromPathSperator);
    return pathArray.map((path, i) => {
      currentLocation += path;
      const pathPartPath = currentLocation;
      return {
        path,
        onClick: () => event("changeCurrentPath", pathPartPath),
      };
    });
  };

  render() {
    const {
      classes,
      files,
      event,
      currentPath,
      platfromPathSperator,
    } = this.props;
    const { fileIsOverFile } = this.state;
    return (
      <div className={classes.root}>
        <div className={classes.locationBarContainer}>
          <div className={classes.locationBar}>
            <div className={classes.breadcrumbFilesContainer}>
              {this.getBreadcrumbLocations().map((breadcrumbItem, index) => (
                <div
                  className={classes.breadcrumbButtonItem}
                  key={index}
                  onClick={breadcrumbItem.onClick}
                >
                  {breadcrumbItem.path}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={classes.fileBoxContainer}>
          <div className={classes.fileBox}>
            {this.state.confirm ? (
              <div className={classes.confirmDialog}>
                <div className={classes.confirmDialogMessage}>
                  {this.state.confirm.message}
                </div>
                <div className={classes.confirmDialogButtons}>
                  <Button
                    className={classes.confirmDialogButton}
                    onClick={() =>
                      this.setState((state) =>
                        state.confirm?.message
                          ? {
                              confirm: {
                                message: state.confirm.message,
                                result: false,
                              },
                            }
                          : {}
                      )
                    }
                  >
                    Cancel
                  </Button>
                  <Button
                    primary
                    className={`${classes.confirmDialogButton} ${classes.confirmDialogButtonPrimary}`}
                    onClick={() =>
                      this.setState((state) =>
                        state.confirm?.message
                          ? {
                              confirm: {
                                message: state.confirm.message,
                                result: true,
                              },
                            }
                          : {}
                      )
                    }
                  >
                    OK
                  </Button>
                </div>
              </div>
            ) : (
              <div className={classes.fileContainer}>
                {files.map((file, index) => (
                  <div
                    className={classes.file}
                    key={index}
                    draggable
                    style={{
                      backgroundColor:
                        fileIsOverFile === index ? "#1115" : "#1110",
                    }}
                    onDrag={(e) => {
                      this.dragedFile = file;
                    }}
                    onDragEnd={async () => {
                      if (this.dropedFolder && this.dragedFile) {
                        const newPath = `${currentPath}${platfromPathSperator}${this.dropedFolder.name}${platfromPathSperator}${this.dragedFile.name}`;
                        const originalPath = `${currentPath}${platfromPathSperator}${this.dragedFile.name}`;
                        this.setState({
                          confirm: {
                            message: ` do you want to move ${originalPath} to ${newPath}`,
                          },
                        });
                        const result = await new Promise((resolve) => {
                          const checkForResult = () => {
                            if (
                              this.state.confirm &&
                              this.state.confirm.result !== undefined
                            ) {
                              resolve(this.state.confirm.result);
                              this.setState({ confirm: undefined });
                            } else {
                              setTimeout(checkForResult, 5);
                            }
                          };
                          checkForResult();
                        });
                        if (result) {
                          event("move", {
                            newPath,
                            originalPath,
                          });
                        }
                      }
                    }}
                    onDragOverCapture={(e) => {
                      if (file.isFolder && this.dragedFile?.name !== file.name) {
                        console.log("drag start");
                        this.dropedFolder = file;
                        this.setState({ fileIsOverFile: index });
                      }
                    }}
                    onDragLeaveCapture={() => {
                      setTimeout(() => {
                        if (this.dropedFolder?.name === file.name) {
                          console.log("drag stop");
                          this.dropedFolder = undefined;
                          this.setState({ fileIsOverFile: undefined });
                        }
                      }, 50);
                    }}
                    onClick={() =>
                      file.isFolder &&
                      event(
                        "changeCurrentPath",
                        `${currentPath}${platfromPathSperator}${file.name}${platfromPathSperator}`
                      )
                    }
                  >
                    <div className={classes.fileName}>{file.name}</div>
                    {file.isFolder ? (
                      <Icon
                        className={classes.fileIcon}
                        iconName={
                          fileIsOverFile === index ? "FolderOpen" : "Folder"
                        }
                      />
                    ) : (
                      <Icon
                        className={classes.fileIcon}
                        iconName="TextDocument"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Explorer);
