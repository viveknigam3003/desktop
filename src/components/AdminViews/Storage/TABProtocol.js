import React from "react";
import PropTypes from "prop-types";
import TabPanel from "./RSETabPanel";
import {
  TextField,
  makeStyles,
  InputLabel,
  FormGroup,
} from "@material-ui/core";
import ColoredLine from "../../Utils/ColoredLine";

const useStyles = makeStyles({
  inputLabel: {
    marginBottom: 10,
    color: "#354992",
  },
  host: {
    width: "60%",
  },
  textfield: {
    width: "50%",
    marginBottom: 20,
  },
  smallTextField: {
    width: "15%",
    margin: 10
  }
});

function TABProtocol(props) {
  const classes = useStyles();

  return (
    <TabPanel value={props.value} index={1}>
      {props.protocols.map((item) => (
        <div key={`${item.hostname}:${item.port}`}>
          <div style={{ display: "flex", width: "100%" }}>
            <div>
              <InputLabel className={classes.inputLabel}>Hostname</InputLabel>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                name="hostname"
                defaultValue={item.hostname}
              />
            </div>
            <div>
              <InputLabel className={classes.inputLabel}>Port</InputLabel>
              <TextField
                variant="outlined"
                size="small"
                type="number"
                name="port"
                className={classes.textfield}
                defaultValue={item.port}
              />
            </div>
          </div>
          <InputLabel className={classes.inputLabel}>Prefix</InputLabel>
          <TextField
            variant="outlined"
            size="small"
            name="item"
            className={classes.textfield}
            defaultValue={item.prefix}
          />
          <InputLabel className={classes.inputLabel}>Scheme</InputLabel>
          <TextField
            variant="outlined"
            size="small"
            name="scheme"
            className={classes.textfield}
            defaultValue={item.scheme}
          />
          <InputLabel className={classes.inputLabel}>Protocol</InputLabel>
          <TextField
            variant="outlined"
            size="small"
            name="impl"
            className={classes.textfield}
            defaultValue={item.impl}
          />
          <InputLabel className={classes.inputLabel}>Domains</InputLabel>
          <InputLabel className={classes.inputLabel}>WAN</InputLabel>
          <FormGroup row style={{ paddingBottom: 12 }}>
            <TextField className={classes.smallTextField} size="small" variant="outlined" type="number" label="Read" value={item.domains.lan.read}/>
            <TextField className={classes.smallTextField} size="small" variant="outlined" type="number" label="Write" value={item.domains.lan.write}/>
            <TextField className={classes.smallTextField} size="small" variant="outlined" type="number" label="Delete" value={item.domains.lan.delete}/>
          </FormGroup>
          <InputLabel className={classes.inputLabel}>LAN</InputLabel>
          <FormGroup row style={{ paddingBottom: 12 }}>
            <TextField className={classes.smallTextField} size="small" variant="outlined" type="number" label="Read" value={item.domains.wan.read}/>
            <TextField className={classes.smallTextField} size="small" variant="outlined" type="number" label="Write" value={item.domains.wan.write}/>
            <TextField className={classes.smallTextField} size="small" variant="outlined" type="number" label="Delete" value={item.domains.wan.delete}/>
            <TextField className={classes.smallTextField} size="small" variant="outlined" type="number" label="Third Party Copy" value={item.domains.wan.third_party_copy}/>
          </FormGroup>
          <ColoredLine color="#000000" opacity={0.2} />
        </div>
      ))}
    </TabPanel>
  );
}

TABProtocol.propTypes = {
  value: PropTypes.any.isRequired,
  protocols: PropTypes.array,
};

export default TABProtocol;
