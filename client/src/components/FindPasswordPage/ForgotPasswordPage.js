import React, { useState } from "react";
import Alert from "@material-ui/lab/Alert";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import DraftsIcon from "@material-ui/icons/Drafts";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import axios from "axios";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © Sungpyo Cho  "}
      {new Date().getFullYear()}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: "#3f50b5",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: "#757ce8",
    color: "white",
  },
}));

export default function ForgotPasswordPage(props) {
  const classes = useStyles();

  const [Email, setEmail] = useState("");
  const [showError, setShowError] = useState(false);
  const [sentEmail, setSentEmail] = useState(false);

  const emailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };

  const sendEmailHandler = (event) => {
    event.preventDefault(); // prevent page refresh

    if (Email === "") {
      alert("Enter your email.");
    } else {
      axios
        .post("/api/users/forgot", {
          email: Email,
        })
        .then((res) => {
          if (res.data.message === "email not found") {
            setShowError(true);
            setSentEmail(false);
          } else if (res.data.message === "password reset mail sent") {
            setShowError(false);
            setSentEmail(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <DraftsIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Password assistance
        </Typography>
        <Typography>Enter the email address of your account.</Typography>
        <Typography>We will send password reset URL to your email.</Typography>
        <form className={classes.form} onSubmit={sendEmailHandler} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="email address"
            name="email"
            autoComplete="email"
            autoFocus
            value={Email}
            onChange={emailHandler}
          />
          {showError && <Alert severity="error">Email not found</Alert>}
          {sentEmail && (
            <Alert severity="success">Password reset email sent!</Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className={classes.submit}
          >
            Continue
          </Button>
        </form>
      </div>
      <Box mt={4}>
        <Copyright />
      </Box>
    </Container>
  );
}
