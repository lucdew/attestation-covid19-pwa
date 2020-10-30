import React, { useEffect, useState } from "react";
import Slider from "@material-ui/core/Slider";
import { makeStyles } from "@material-ui/core/styles";
import pdfGen from "./pdfGen";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
  slider: {
    margin: 15,
  },
}));

function timeShiftText(value) {
  return `${value}m`;
}

const marks = [
  {
    value: -120,
    label: "120m",
  },
  {
    value: -60,
    label: "-60m",
  },
  {
    value: 0,
    label: "0m",
  },
  {
    value: 60,
    label: "60m",
  },
  {
    value: 120,
    label: "120m",
  },
];

export default function Home({ useHistory }) {
  const classes = useStyles();
  const history = useHistory();
  const [timeShiftInMin, setTimeShiftInMin] = useState(-45);

  useEffect(() => {
    if (!localStorage.getItem("config")) {
      console.log("Pushing history");
      history.push("/config");
    }
  }, []);

  async function genPdf(reason) {
    // const reason = evt.target.id.substring("bttn-".length);
    await pdfGen([reason], timeShiftInMin);
  }

  function handleTimeShiftChange(event, newValue) {
    setTimeShiftInMin(newValue);
  }

  return (
    <div>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        spacing={5}
      >
        <Grid item>
          <Button
            variant="contained"
            component="span"
            onClick={genPdf.bind(this, "sport")}
          >
            Sport
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            component="span"
            onClick={genPdf.bind(this, "courses")}
          >
            Courses
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            component="span"
            onClick={genPdf.bind(this, "travail")}
          >
            Travail
          </Button>
        </Grid>
        <Grid item>
          <Button
            id="bttn-famille"
            variant="contained"
            component="span"
            onClick={genPdf.bind(this, "famille")}
          >
            Famille
          </Button>
        </Grid>
        <Grid item>
          <Button
            id="bttn-sante"
            variant="contained"
            component="span"
            onClick={genPdf.bind(this, "sante")}
          >
            Santé
          </Button>
        </Grid>
        <Grid item>
          <Button
            id="bttn-enfant"
            variant="contained"
            component="span"
            onClick={genPdf.bind(this, "enfants")}
          >
            Enfants
          </Button>
        </Grid>
        <Grid item>
          <div className={classes.slider}>
            <Slider
              value={timeShiftInMin}
              getAriaValueText={timeShiftText}
              aria-labelledby="discrete-slider-always"
              onChange={handleTimeShiftChange}
              step={10}
              min={-120}
              max={120}
              track={false}
              marks={marks}
              valueLabelDisplay="on"
            />
            <Typography id="discrete-slider-always" gutterBottom>
              Time shift in minutes
            </Typography>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

Home.propTypes = {
  useHistory: PropTypes.func,
};
