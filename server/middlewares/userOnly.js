const userOnly = (req, res, next) => {
  if (req.decoded.role === 'user') {
    next()
  } else {
    res.status(403).json({
      status: 'failed',
      message: `you're not auhtorized for doing this actions`
    })
  }
}

module.exports = userOnly