import ThemeProviderInterface from "@web-desktop-environment/interfaces/lib/views/ThemeProvider";
import { ReflowReactComponent } from "@mcesystems/reflow-react-display-layer";
import * as React from "react";
import { Themes } from "@root/theme";
import { ThemeProvider as TP } from "@material-ui/styles";

// using ReflowReactComponent in this case provides the event() and done() callbacks.
class ThemeProvider extends ReflowReactComponent<ThemeProviderInterface> {
  render() {
    return <TP theme={Themes[this.props.theme]}>{this.props.children}</TP>;
  }
}

export default ThemeProvider;
