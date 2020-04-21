import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import HomeIcon from "@material-ui/icons/Home";
import Home from "./home";
import Config from "./config";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  content: {
    margin: 15,
  },
  link: {
    textDecoration: "none!important",
  },
}));

export default function App() {
  const classes = useStyles();
  return (
    <Router>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              component={Link}
              to={"/config"}
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Attestation covid19
            </Typography>
            <IconButton
              component={Link}
              to={"/"}
              color="inherit"
              aria-label="home"
            >
              <HomeIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div id="content" className={classes.content}>
          <Switch>
            <Route exact path="/">
              <Home useHistory={useHistory} />
            </Route>
            <Route path="/config">
              <Config useHistory={useHistory} />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}
