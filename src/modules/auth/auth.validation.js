import joi from 'joi'

export const signupSchema= {
    query:joi.object({}).keys({
        ln:joi.string().valid('en', 'ar')
    }),
    body:joi.object({}).keys({
        username:joi.string().length(4).trim().required(),
        email:joi.string().email().required().trim(),
        gender:joi.string().valid('male', 'female').required().insensitive().trim(),
        age:joi.number().min(12).max(100).positive().required(),
        colors:joi.array().items(joi.string().trim()).required(),
        DOB:joi.date(),
        password:joi.string().min(1).required()
    })
}

