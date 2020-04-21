import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import DateFnsUtils from "@date-io/date-fns";
import PropTypes from "prop-types";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

export default function Config({ useHistory }) {
  const history = useHistory();
  const [config, setConfig] = useState({
    firstName: "",
    lastName: "",
    address: "",
    zipCode: "",
    city: "",
    dateOfBirth: undefined,
    cityOfBirth: "",
  });

  useEffect(() => {
    const storedConfig = localStorage.getItem("config");
    if (storedConfig) {
      console.log("setting config");
      console.log(config.firstName);
      setConfig(JSON.parse(storedConfig));
    }
  }, [setConfig]);

  function handleSubmit(evt) {
    evt.preventDefault();
  }
  function handleDateChange(date) {
    setConfig({
      ...config,
      dateOfBirth: date,
    });
  }
  function onChange(evt, value) {
    const modelName = evt.target.id;
    const modelValue = value !== undefined ? value : evt.target.value;
    console.log(`Setting ${modelName}=${modelValue}`);
    setConfig({
      ...config,
      [modelName]: modelValue,
    });
  }
  function onSave(evt) {
    evt.preventDefault();
    localStorage.setItem("config", JSON.stringify(config));
    history.push("/");
  }
  return (
    <div id="configContainer">
      <form id="configForm" onSubmit={handleSubmit} noValidate>
        <div>
          <TextField
            id="firstName"
            label="FirstName"
            required
            margin="normal"
            fullWidth
            onChange={onChange}
            value={config.firstName}
          />
        </div>
        <div>
          <TextField
            id="lastName"
            label="LastName"
            required
            margin="normal"
            fullWidth
            onChange={onChange}
            value={config.lastName}
          />
        </div>
        <div>
          <TextField
            id="address"
            label="Address"
            required
            margin="normal"
            fullWidth
            onChange={onChange}
            value={config.address}
          />
        </div>
        <div>
          <TextField
            id="zipCode"
            label="ZipCode"
            required
            margin="normal"
            fullWidth
            onChange={onChange}
            value={config.zipCode}
          />
        </div>
        <div>
          <TextField
            id="city"
            label="City"
            required
            margin="normal"
            fullWidth
            onChange={onChange}
            value={config.city}
          />
        </div>
        <div>
          <TextField
            id="cityOfBirth"
            label="City Of Birth"
            required
            margin="normal"
            fullWidth
            onChange={onChange}
            value={config.cityOfBirth}
          />
        </div>
        <div>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container>
              <KeyboardDatePicker
                format="dd/MM/yyyy"
                margin="normal"
                required
                id="dateOfBirth"
                label="Date of birth"
                value={config.dateOfBirth}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
        </div>
        <div>
          <Button variant="contained" type="submit" onClick={onSave}>
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}

Config.propTypes = {
  useHistory: PropTypes.func,
};
