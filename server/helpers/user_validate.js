const Joi = require("joi");

const validateBody = (schema) => {
    return (req, res, next) => {
        const validatorResult = schema.validate(req.body);

        if (validatorResult.error) {
            return res.status(400).json(validatorResult.error);
        } else {
            if (!req.value) req.value = {};
            if (!req.value["params"]) req.value.params = {};

            req.value.body = validatorResult.value;
            next();
        }
    };
};

const validateParam = (schema, name) => {
    return (req, res, next) => {
        const validatorResult = schema.validate({ param: req.params[name] });

        if (validatorResult.error) {
            return res.status(400).json(validatorResult.error);
        } else {
            if (!req.value) req.value = {};
            if (!req.value["params"]) req.value.params = {};

            req.value.params[name] = req.params[name];
            next();
        }
    };
};

const schemas = {
    authSignInSchema: Joi.object().keys({
        phone: Joi.string()
            .regex(/((09|03|07|08|05)+([0-9]{8})\b)/)
            .required(),
        password: Joi.string().min(6).required(),
    }),

    authSignUpSchema: Joi.object().keys({
        name: Joi.string().min(2).required(),
        phone: Joi.string()
            .regex(/((09|03|07|08|05)+([0-9]{8})\b)/)
            .required(),
        password: Joi.string().min(6).required(),
    }),
    authChangePasswordSchema: Joi.object().keys({
        password: Joi.string().min(6).required(),
        reEnterPassword: Joi.string().min(6).required(),
        newPassword: Joi.string().min(6).required(),
    }),

    // deckSchema: Joi.object().keys({
    //     name: Joi.string().min(6).required(),
    //     description: Joi.string().min(10).required(),
    // }),

    // deckOptionalSchema: Joi.object().keys({
    //     name: Joi.string().min(6),
    //     description: Joi.string().min(10),
    //     owner: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    // }),

    idSchema: Joi.object().keys({
        param: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(),
    }),

    // newDeckSchema: Joi.object().keys({
    //     name: Joi.string().min(6).required(),
    //     description: Joi.string().min(10).required(),
    //     owner: Joi.string()
    //         .regex(/^[0-9a-fA-F]{24}$/)
    //         .required(),
    // }),

    // userSchema: Joi.object().keys({
    //     username: Joi.string().min(2).required(),
    //     phone: Joi.string()
    //         .regex(/((09|03|07|08|05)+([0-9]{8})\b)/)
    //         .required(),
    // }),

    // userOptionalSchema: Joi.object().keys({
    //     username: Joi.string().min(2),
    //     phone: Joi.string().regex(/((09|03|07|08|05)+([0-9]{8})\b)/),
    // }),
};

module.exports = {
    validateBody,
    validateParam,
    schemas,
};
