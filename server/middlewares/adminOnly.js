const adminOnly = (req, res, next) => {
  if (req.decoded.role === 'admin') {
    console.log(req.decoded.role)
    next()
  } else {
    res.status(403).json({
      status: 'failed',
      message: `you're not auhtorized for doing this actions`
    })
  }
}

module.exports = adminOnly