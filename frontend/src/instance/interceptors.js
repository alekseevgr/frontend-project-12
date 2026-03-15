export const setupInterceptors = (instance, store) => {
  instance.interceptors.request.use((config) => {
    const token = store.getState().auth.token

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  })
}
