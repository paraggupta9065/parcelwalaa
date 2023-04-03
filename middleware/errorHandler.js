// Not completed yet
// Some task remaining

module.exports = (err, req, res, next) => {
  console.log('hittt')
  console.log(err)
  return res.status(500).send('An unknown error occurred.')
}
