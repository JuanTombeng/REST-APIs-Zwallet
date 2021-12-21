const handleURLNotFound = (req, res, next) => {
    res.status(404)
    res.json({
      message: 'URL Not Found'
    })
  }

const response = (res, result, status, message, error, pagination)=>{
  res.status(status).json({
    status: 'Success!',
    code: status || 200,
    data: result,
    message: message || null,
    error : error || null,
    pagination : pagination
  })
}

module.exports = {
    handleURLNotFound,
    response
}