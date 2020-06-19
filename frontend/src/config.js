const COGNITO_DOMAIN = "scratchlists.auth.eu-central-1.amazoncognito.com"
const CLIENT_ID = "3lm2ad6qbjd1a1srceqq0966su"
const LOGIN_CALLBACK_URI = "http://localhost:3000/login"
const LOGOUT_CALLBACK_URI = "http://localhost:3000/logout"

const Config = {
    COGNITO_UI_URL: `https://${COGNITO_DOMAIN}/login?client_id=${CLIENT_ID}&response_type=token&scope=openid&redirect_uri=${LOGIN_CALLBACK_URI}`,
    COGNITO_LOGOUT_URL: `https://${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${LOGOUT_CALLBACK_URI}`,
    COGNITO_USERINFO_URL: `https://${COGNITO_DOMAIN}/oauth2/userInfo`,
    API_GATEWAY_URL: "https://fjt42edot8.execute-api.eu-central-1.amazonaws.com/default/scratchlists"
}

export default Config;