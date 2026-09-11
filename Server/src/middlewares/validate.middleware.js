function validate(schema, source = 'body') {
  return (req, res, next) => {
    const { error } = schema.validate(req[source]);

    if (error) {
      return res.status(422).json({
        success: false,
        message: error.details[0].message,
      });
    }

    next();
  };
}

module.exports = validate;