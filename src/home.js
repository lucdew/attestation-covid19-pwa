import React, { useEffect, useState, useRef } from "react";
import Slider from "@material-ui/core/Slider";
import { makeStyles } from "@material-ui/core/styles";
import pdfGen from "./pdfGen";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";

import constants from "./constants";

const useStyles = makeStyles((theme) => ({
  slider: {
    margin: 15,
    width: "90%",
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
  const clickedRef = useRef(0);

  useEffect(() => {
    if (!localStorage.getItem("config")) {
      console.log("Pushing history");
      history.push("/config");
    }
  }, [history]);

  async function genPdf(reason) {
    const now = new Date();
    let fileNameSuffix = "";

    // quick woraround to force downloading the file
    if (clickedRef.current !== 0) {
      const lastPdfGenDate = new Date(clickedRef.current);
      if (
        lastPdfGenDate.getMinutes() === now.getMinutes() &&
        lastPdfGenDate.getHours() === now.getHours()
      ) {
        fileNameSuffix = `-${now.getTime()}`;
      }
    }
    clickedRef.current = now.getTime();

    // const reason = evt.target.id.substring("bttn-".length);
    await pdfGen([reason], timeShiftInMin, fileNameSuffix);
  }

  function handleTimeShiftChange(event, newValue) {
    setTimeShiftInMin(newValue);
  }

  const items = constants.reasons.map((r, idx) => (
    <Grid
      container
      item
      key={idx}
      xs={6}
      justify={idx % 2 === 0 ? "flex-end" : "flex-start"}
    >
      {" "}
      <Button
        variant="contained"
        component="span"
        onClick={genPdf.bind(this, r.name)}
      >
        {r.text || r.name}
      </Button>
    </Grid>
  ));

  return (
    <div>
      <Grid container spacing={5}>
        {items}
        <Grid container item xs={12}>
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
            <Typography
              id="discrete-slider-always"
              style={{ textAlign: "center" }}
              gutterBottom
            >
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
