import React, { useState } from "react";
import { makeStyles, AccordionDetails } from "@material-ui/core";
import PropTypes from "prop-types";
import EditButtons from "./ServerConfigEditButtons";
import ServerConfigEditForm from "./ServerConfigEditForm";
import ServerConfigTitle from "./ServerConfigTitle";
import DialogNewSection from "./DialogNewSection";
import { useDispatch } from "react-redux";
import { addConfig, delConfig, getConfig } from "../../Utils/Config";

const useStyles = makeStyles((theme) => ({
  root: {
    fontFamily: "Inter",
    fontSize: theme.typography.pxToRem(15),
    minWidth: "100%",
  },
  section: {
    padding: theme.typography.pxToRem(2),
  },
  sectionTitle: {
    color: "#3e55ab",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "60%",
  },
  options: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: "60%",
  },
  optionName: {
    overflowWrap: "break-word",
    padding: theme.typography.pxToRem(10),
  },
  optionValue: {
    overflowWrap: "break-word",
    padding: theme.typography.pxToRem(10),
  },
}));

function ServerConfig(props) {
  const classes = useStyles();
  const config = props.config;
  const [editSection, setEditSection] = useState(null);
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState("");
  const [option, setOption] = useState("");
  const [value, setValue] = useState();
  const [optionPayload, setOptionPayload] = useState({});
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
  };

  const handleOptionsUpdate = (event) => {
    setOptionPayload({
      ...optionPayload,
      [event.target.name]: event.target.value,
    });
  };

  React.useEffect(() => {
    console.log(props.server, section);
  }, [props.server, section]);

  const handleNewSectionDialog = (section) => {
    setSection(section);
    setOpen(true);
  };

  const fetchConfig = async () => {
    dispatch({ type: "LOADING_TRUE" });
    getConfig(props.server)
      .then((res) => {
        if (res.status === 200) props.setConfig(res.data);
      })
      .then(dispatch({ type: "LOADING_FALSE" }))
      .catch((err) => console.log(err));
  };

  const handleOptionSubmit = () => {
    dispatch({ type: "LOADING_TRUE" });
    addConfig(props.server, {
      section: section,
      option: option,
      value: value,
    })
      .then((res) => props.setStatus(res.status))
      .then(setEditSection(null))
      .then(async () => await fetchConfig())
      .then(dispatch({ type: "LOADING_FALSE" }))
      .then(setOpen(false))
      .then(() => dispatch({ type: "SHOW_SNACKBAR" }));
  };

  const handleBulkOptionUpdate = (section) => {
    dispatch({ type: "LOADING_TRUE" });
    Object.keys(optionPayload).map(async (option) => {
      console.log(section, option, optionPayload[option]);
      await addConfig(props.server, {
        section: section,
        option: option,
        value: optionPayload[option],
      });
    });
  };

  function validateInput() {
    return section.length > 0 && option.length > 0;
  }

  const handleDelete = (server, section, option) => {
    dispatch({ type: "LOADING_TRUE" });
    delConfig(server, {
      section: section,
      option: option,
    })
      .then((res) => props.setStatus(res.status))
      .then(setEditSection(null))
      .then(async () => await fetchConfig())
      .then(dispatch({ type: "LOADING_FALSE" }))
      .then(setOpen(false))
      .then(() => dispatch({ type: "SHOW_SNACKBAR" }));
  };

  return (
    <AccordionDetails>
      <div className={classes.root}>
        <ServerConfigTitle
          server={props.server}
          onSectionAdd={() => setEditSection(null)}
          fetchConfig={fetchConfig}
        />
        {Object.keys(config).map((section, index) => (
          <div key={section} className={classes.section}>
            <div className={classes.sectionTitle}>
              {section}
              {index === editSection ? (
                <EditButtons
                  editMode={true}
                  cancelEdit={() => {
                    setEditSection(null);
                    setOptionPayload({});
                  }}
                  confirmEdit={() => handleBulkOptionUpdate(section)}
                  newOption={() => handleNewSectionDialog(section)}
                />
              ) : (
                <EditButtons
                  editMode={false}
                  onClick={() => setEditSection(index)}
                />
              )}
            </div>
            {Object.keys(config[section]).map((option) => (
              <div key={option} className={classes.options}>
                {index === editSection ? (
                  <ServerConfigEditForm
                    section={section}
                    option={option}
                    optionValue={config[section][option]}
                    server={props.server}
                    handleDelete={() =>
                      handleDelete(props.server, section, option)
                    }
                    handleChange={handleOptionsUpdate}
                  />
                ) : (
                  <React.Fragment>
                    <div id="option-name" className={classes.optionName}>
                      {option}
                    </div>
                    <div id="option-value" className={classes.optionValue}>
                      {config[section][option].toString()}
                    </div>
                  </React.Fragment>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <DialogNewSection
        title={`Add new option to ${section}`}
        subtitle="Specify an option with a value to add"
        loadingMessage="Adding new option"
        section={section}
        setOption={setOption}
        setValue={setValue}
        disabled={!validateInput()}
        open={open}
        handleClose={handleClose}
        handleSubmit={handleOptionSubmit}
      />
    </AccordionDetails>
  );
}

ServerConfig.propTypes = {
  config: PropTypes.object,
  setConfig: PropTypes.func,
  server: PropTypes.string,
  setStatus: PropTypes.func,
};

export default ServerConfig;
