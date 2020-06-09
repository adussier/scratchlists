const CLIENT_ID = "3lm2ad6qbjd1a1srceqq0966su"

const Config = {
    COGNITO_UI_URL : `https://scratchlists.auth.eu-central-1.amazoncognito.com/login?client_id=${CLIENT_ID}&response_type=token&scope=email+https://scratchlists.resource.server/scratchlists.all+openid+profile&redirect_uri=http://localhost:3000/login`
}

export default Config;