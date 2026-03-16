import * as yup from 'yup'

const getValidationSchema = (t) =>
  yup.object({
    username: yup
      .string()
      .trim()
      .min(3, t('form.symbolsRange'))
      .max(20, t('form.symbolsRange'))
      .required(t('form.required')),
    password: yup
      .string()
      .trim()
      .min(6, t('form.minPassword'))
      .required(t('form.required')),
    confirmPassword: yup
      .string()
      .trim()
      .oneOf([yup.ref('password')], t('form.equalPassword'))
      .required(t('form.required')),
  })

const defaultNormalize = (v) => v?.trim() ?? ''

export const getChannelValidationSchema = ({
  t,
  channels,
  channelId = null,
  normalize = defaultNormalize,
}) =>
  yup.object({
    name: yup
      .string()
      .trim()
      .min(3, t('form.symbolsRange'))
      .max(20, t('form.symbolsRange'))
      .required(t('form.required'))
      .test('unique', t('channels.unique'), (value) => {
        const name = normalize(value)
        return !channels.some(
          (c) => normalize(c.name) === name && c.id !== channelId,
        )
      }),
  })

export const getLoginValidationSchema = (t) =>
  yup.object({
    username: yup.string().trim().required(t('form.required')),
    password: yup.string().trim().required(t('form.required')),
  })

export default getValidationSchema
