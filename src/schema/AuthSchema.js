import joi from 'joi'

export const userSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(4).required(),
    confirmePassword: joi.any().valid(joi.ref("password")).required(),
})

export const signInSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});
