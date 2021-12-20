const handleURLNotFound = (req, res, next) => {
    res.status(404)
    res.json({
      message: 'URL Not Found'
    })
  }

const response = (res, result, status, error)=>{
    res.status(status).json({
        status: 'Success!',
        code: status || 200,
        data: result,
        message: error || null
    })
}

module.exports = {
    handleURLNotFound,
    response
}