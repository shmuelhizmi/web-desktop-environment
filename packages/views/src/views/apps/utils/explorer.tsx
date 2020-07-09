import ExplorerInterface, {
  File,
} from "@web-desktop-environment/interfaces/lib/views/apps/utils/Explorer";
import { ReflowReactComponent } from "@mcesystems/reflow-react-display-layer";
import * as React from "react";
import { withStyles, createStyles, WithStyles } from "@material-ui/styles";
import { Theme } from "../../../theme";
import { Icon, Button, TextField } from "@fluentui/react";

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
    actionBarContainer: {
      height: 49,
      marginBottom: 10,
      width: "100%",
      justifyContent: "center",
      display: "flex",
    },
    actionBar: {
      boxShadow: "-1px 2px 20px 1px #0007",
      borderBottom: "1px solid #333",
      backdropFilter: "blur(20px)",
      marginTop: 10,
	  height: "100%",
	  justifyContent: "center",
	  padding: 4,
      borderRadius: 10,
      display: "flex",
    },
    actionButton: {
      margin: 4,
      padding: 3,
      minWidth: 40,
      textAlign: "center",
      userSelect: "none",
      fontFamily: "cursive",
      color: "#fff",
      fontSize: 25,
      borderRadius: 5,
      border: "1px solid #fff",
      cursor: "pointer",
      backgroundColor: "#0001",
      "&:hover": {
        backgroundColor: "#0002",
      },
	},
	actionButtonDisabled: {
		cursor: "none",
		border: "none",
		backgroundColor: "#0004",
		"&:hover": {
		  backgroundColor: "#0004",
		},
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
      height: "90%",
      width: "100%",
      display: "flex",
      justifyContent: "center",
    },
    fileBox: {
      margin: 15,
	  boxShadow: "#000000 0px 0px 20px -6px inset",
	  background: "#eee4",
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
    dialog: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
      flexDirection: "column",
    },
    dialogMessage: {
      maxWidth: "80%",
      fontFamily: "cursive",
      textAlign: "center",
      color: "#fff",
      fontSize: 25,
    },
    dialogButtons: {
      margin: 20,
      width: "50%",
      display: "flex",
      justifyContent: "center",
    },
    dialogButton: {
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
    dialogButtonPrimary: {
      background: "rgba(0, 120, 212, 0.7)",
      "&:hover": {
        background: "rgba(0, 120, 212, 0.9)",
      },
    },
    dialogInput: {
      margin: 10,
      "& .ms-TextField-fieldGroup": {
        background: "transparent",
        border: "none",
        borderBottom: "1px solid #fff",
        "& input": {
          fontSize: 20,
          fontWeight: 600,
          color: "#fff",
        },
        "& input::placeholder": {
          fontSize: 20,
          fontWeight: 600,
          color: "#fff",
        },
      },
      color: "#fff",
      fontSize: 25,
    },
  });

interface ExplorerState {
  fileIsOverFile?: number;
  selectedFile?: number;
  copyPath?: { fullPath: string; name: string };
  cutPath?: { fullPath: string; name: string };
  confirm?: {
    message: string;
    result?: boolean;
  };
  prompt?: {
    message: string;
    value: string;
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
  selectedFile?: File & { fullPath: string };
  constructor(props: Explorer["props"]) {
    super(props);
    this.state = {};
  }

  confirm = async (message: string) => {
    return await new Promise((resolve) => {
      this.setState(
        {
          confirm: {
            message,
          },
        },
        () => {
          const checkForResult = () => {
            const { confirm } = this.state;
            if (confirm && confirm.result !== undefined) {
              resolve(confirm.result);
              this.setState({ confirm: undefined });
            } else {
              setTimeout(checkForResult, 5);
            }
          };
          checkForResult();
        }
      );
    });
  };

  prompt = async (
    message: string
  ): Promise<{ result: boolean; value: string }> => {
    return await new Promise((resolve) => {
      this.setState(
        {
          prompt: {
            message,
            value: "",
          },
        },
        () => {
          const checkForResult = () => {
            const { prompt } = this.state;
            if (prompt && prompt.result !== undefined) {
              resolve({ result: prompt.result, value: prompt.value });
              this.setState({ prompt: undefined });
            } else {
              setTimeout(checkForResult, 5);
            }
          };
          checkForResult();
        }
      );
    });
  };

  getBreadcrumbLocations = (): { path: string; onClick: () => void; onDrop: () => void }[] => {
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
		onClick: () => {
			event("changeCurrentPath", pathPartPath);
			this.setState({ selectedFile: undefined });
			this.selectedFile = undefined;
		},
		onDrop: () => this.onDropPath(pathPartPath),
      };
    });
  };

  private onDrop = async (target: File) => {
    const { currentPath, platfromPathSperator, event } = this.props;
    if (this.dragedFile && this.dragedFile !== target && target.isFolder) {
      const newPath = `${currentPath}${platfromPathSperator}${target.name}${platfromPathSperator}${this.dragedFile.name}`;
      const originalPath = `${currentPath}${platfromPathSperator}${this.dragedFile.name}`;
      this.setState({
        fileIsOverFile: undefined,
        selectedFile: undefined,
      });
      if (
        await this.confirm(
          ` do you want to move ${this.dragedFile.name} to ${newPath}`
        )
      ) {
        event("move", {
          newPath,
          originalPath,
        });
      }
    }
  };

  private onDropPath = async (path: string) => {
	  console.log("drop")
    const { currentPath, platfromPathSperator, event } = this.props;
    if (this.dragedFile) {
      const newPath = `${path}${platfromPathSperator}${this.dragedFile.name}`;
      const originalPath = `${currentPath}${platfromPathSperator}${this.dragedFile.name}`;
      this.setState({
        fileIsOverFile: undefined,
        selectedFile: undefined,
      });
      if (
        await this.confirm(
          ` do you want to move ${this.dragedFile.name} to ${newPath}`
        )
      ) {
        event("move", {
          newPath,
          originalPath,
        });
      }
    }
  };

  private onFileDragOver = (file: File, index: number) => {
    if (
      file.isFolder &&
      this.dragedFile?.name !== file.name &&
      this.state.fileIsOverFile !== index
    ) {
      this.setState({ fileIsOverFile: index });
    }
  };

  deleteSelected = async () => {
    if (
      this.selectedFile &&
      (await this.confirm(
        `are you sure you want to delete ${this.selectedFile.name}`
      ))
    ) {
      this.props.event("delete", this.selectedFile.name);
    }
  };

  createFolder = async () => {
    const promptCreate = await this.prompt("please enter folder name:");
    if (promptCreate.value) {
      this.props.event("createFolder", promptCreate.value);
    }
  };

  render() {
    const {
      classes,
      files,
      event,
      currentPath,
      platfromPathSperator,
    } = this.props;
    const { fileIsOverFile, selectedFile, copyPath, cutPath } = this.state;
    return (
      <div className={classes.root}>
        <div className={classes.locationBarContainer}>
          <div className={classes.locationBar}>
            <div className={classes.breadcrumbFilesContainer}>
              {this.getBreadcrumbLocations().map((breadcrumbItem, index) => (
                <div
                  className={classes.breadcrumbButtonItem}
				  key={index}
				  onDrop={breadcrumbItem.onDrop}
				  onDragOverCapture={(e) => e.preventDefault()}
                  onClick={breadcrumbItem.onClick}
                >
                  {breadcrumbItem.path}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={classes.actionBarContainer}>
          <div className={classes.actionBar}>
            <div className={classes.actionButton} onClick={this.deleteSelected}>
              Delete
            </div>
            <div className={classes.actionButton} onClick={this.createFolder}>
              Create Folder
            </div>
            <div className={classes.actionButton} onClick={() => this.selectedFile && this.setState({ copyPath: { fullPath: this.selectedFile.fullPath, name: this.selectedFile.name}, cutPath: undefined })}>
              Copy
            </div>
            <div className={classes.actionButton} onClick={() => this.selectedFile && this.setState({ cutPath: { fullPath: this.selectedFile.fullPath, name: this.selectedFile.name}, copyPath: undefined })}>
              Cut
            </div>
            <div className={`${classes.actionButton} ${cutPath || copyPath ? "" : classes.actionButtonDisabled}`} onClick={() => {
				if (cutPath || copyPath) {
					if (this.selectedFile?.isFolder) {
						if (cutPath && cutPath.fullPath !== this.selectedFile?.fullPath) {
							event("move", { newPath: `${this.selectedFile.fullPath}${platfromPathSperator}${cutPath.name}`, originalPath: cutPath.fullPath });
						}
						if (copyPath && copyPath.fullPath !== this.selectedFile?.fullPath) {
							event("copy", { newPath: `${this.selectedFile.fullPath}${platfromPathSperator}${copyPath.name}`, originalPath: copyPath.fullPath });
						}
					} else {
						if (cutPath) {
							event("move", { newPath: `${currentPath}${platfromPathSperator}${cutPath.name}`, originalPath: cutPath.fullPath });
						}
						if (copyPath) {
							event("copy", { newPath: `${currentPath}${platfromPathSperator}${copyPath.name}`, originalPath: copyPath.fullPath });
						}
					}
				}
			}}>
              Past
            </div>
          </div>
        </div>
        <div className={classes.fileBoxContainer}>
          <div className={classes.fileBox}>
            {this.state.prompt && (
              <div className={classes.dialog}>
                <div className={classes.dialogMessage}>
                  {this.state.prompt.message}
                </div>
                <TextField
                  value={this.state.prompt.value}
                  onChange={(_e, newValue) =>
                    this.state.prompt &&
                    this.setState({
                      prompt: { ...this.state.prompt, value: newValue || "" },
                    })
                  }
                  className={classes.dialogInput}
                />
                <div className={classes.dialogButtons}>
                  <Button
                    className={classes.dialogButton}
                    onClick={() =>
                      this.state.prompt &&
                      this.setState({
                        prompt: { ...this.state.prompt, result: false },
                      })
                    }
                  >
                    Cancel
                  </Button>
                  <Button
                    primary
                    className={`${classes.dialogButton} ${classes.dialogButtonPrimary}`}
                    onClick={() =>
                      this.state.prompt &&
                      this.setState({
                        prompt: { ...this.state.prompt, result: true },
                      })
                    }
                  >
                    OK
                  </Button>
                </div>
              </div>
            )}
            {this.state.confirm && (
              <div className={classes.dialog}>
                <div className={classes.dialogMessage}>
                  {this.state.confirm.message}
                </div>
                <div className={classes.dialogButtons}>
                  <Button
                    className={classes.dialogButton}
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
                    className={`${classes.dialogButton} ${classes.dialogButtonPrimary}`}
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
            )}
            {!this.state.prompt && !this.state.confirm && (
              <div className={classes.fileContainer}>
                {files.map((file, index) => (
                  <div
                    className={classes.file}
                    key={index}
                    draggable
                    style={
                      fileIsOverFile === index || selectedFile === index
                        ? {
                            backgroundColor: "#1115",
                            border: "1px solid #fff",
                          }
                        : {}
                    }
                    onDrag={(e) => {
                      this.dragedFile = file;
                    }}
                    onDrop={() => this.onDrop(file)}
                    onDragOverCapture={(e) => {
                      this.onFileDragOver(file, index);
                      e.preventDefault();
                    }}
                    onDragLeave={() => {
                      if (fileIsOverFile === index) {
                        this.setState({ fileIsOverFile: undefined });
                      }
                    }}
                    onClick={() => {
                      if (selectedFile !== index) {
                        this.setState({ selectedFile: index });
                      }
                      this.selectedFile = {...file, fullPath: `${currentPath}${platfromPathSperator}${file.name}`};
                    }}
                    onDoubleClick={() =>
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
