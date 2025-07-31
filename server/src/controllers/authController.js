const JWT_SECRET = process.env.JWT_SECRET

const register = async (req, res) => {
  res.end("register route hit");
}

const login = async (req, res) => {
  res.end("login route hit");
}

module.exports = {register,login}