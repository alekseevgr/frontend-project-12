export default {
  login: () => '/login',
  signup: () => '/signup',
  usersPath: () => '/data',
  channels: () => '/channels',
  removeChannel: id => `/channels/${id}`,
  editChannel: id => `/channels/${id}`,
  messages: () => '/messages',
}
