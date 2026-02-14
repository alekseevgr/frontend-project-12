const apiPath = '/api/v1'

export default {
  loginPath: () => [apiPath, 'login'].join('/'),
  signupPath: () => [apiPath, 'signup'].join('/'),
  usersPath: () => [apiPath, 'data'].join('/'),
  channels: () => [apiPath, 'channels'].join('/'),
  removeChannel: id => [apiPath, `channels/${id}`].join('/'),
  editChannel: id => [apiPath, `channels/${id}`].join('/'),
  messages: () => [apiPath, 'messages'].join('/'),
}
