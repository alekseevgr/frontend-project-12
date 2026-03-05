export const setupInterceptors = (api, store) => {
  api.interceptors.request.use((config) => {
    const token = store.getState().auth.token

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  })
}
