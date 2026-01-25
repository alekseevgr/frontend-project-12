const apiPath = "/api/v1";

export default {
  loginPath: () => [apiPath, "login"].join("/"),
  usersPath: () => [apiPath, "data"].join("/"),
  channels: () => [apiPath, 'channels'].join('/'),
  messages: () => [apiPath, 'messages'].join('/')
};
