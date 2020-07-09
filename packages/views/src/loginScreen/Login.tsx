import React, { useState } from "react";
import { TextField, Text, Button } from "@fluentui/react";
import { Card } from "@uifabric/react-cards";
import { makeStyles } from "@material-ui/styles";

interface LoginProps {
  onLogin: (host: string, port: number) => void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
	height: "100%",
	background: "linear-gradient(45deg, rgba(29,217,105,1) 0%, rgba(0,189,255,1) 100%)",
  },
  card: {
    width: 500,
    maxWidth: 500,
    height: 450,
    maxHeight: 500,
    padding: "70px 60px",
    display: "flex",
	justifyContent: "space-between",
	backdropFilter: "blur(5px)",
	userSelect: "none",
  },
}));

const Login = (props: LoginProps) => {
  const classes = useStyles();
  const [host, setHost] = useState("localhost")
  const [port, setPort] = useState(5000)
  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <Text variant="xLargePlus">Login to your server</Text>
        <TextField value={host} onChange={(_e, newValue) => setHost(newValue || "")} label="host"></TextField>
        <TextField value={String(port || "")} onChange={(_e, newValue) => setPort(Number(newValue))} label="port"></TextField>
        <Button onClick={() => props.onLogin(host, port)} primary>Login</Button>
      </Card>
    </div>
  );
};

export default Login;
