import React from "react";
import { Redirect, useLocation } from "react-router-dom";

function getFragmentParameters(fragment) {
  let data = {};
  let hash = fragment.replace("#", "");
  let params = hash.split("&");
  for (let param of params) {
    let values = param.split("=");
    data[values[0]] = values[1];
  }
  return data;
}

export default function Login(props) {
  let location = useLocation();
  let data = getFragmentParameters(location.hash);
  props.setAuthenticated();

  fetch("https://scratchlists.auth.eu-central-1.amazoncognito.com/oauth2/userInfo", {
      headers: new Headers({
        Authorization: "Bearer " + data.access_token,
      }),
    })
    .then((res) => res.json())
    .then((body) => {
      body.access_token = data.access_token;
      body.id_token = data.id_token;
      props.setUser(body);
    })
    .catch((err) => console.error(err));

  return <Redirect to="/open" />
}
