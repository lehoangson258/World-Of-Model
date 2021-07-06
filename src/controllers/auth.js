const User = require('../models/User');
const bcrypt = require('bcrypt');
const Cart = require('../models/Cart');
// Admin
const viewLogin = (req, res) => {
  res.render('admin/login', {
    error: null,
  })
}

const doLogin = async (req, res) => {
  try {
    const user = {
      email: req.body.mail,
      password: req.body.pass,
    }
    const dataUser = await LogIn(user.email, user.password)
    if (!dataUser || dataUser === null) {
      return res.render('admin/login', {
        error: "Email or password is incorrect"
      })
    }
    req.session.adminId = dataUser._id
    req.session.roleAdmin = dataUser.role
    res.redirect('/admin/dashboard')
  } catch (error) {
    console.error(error);
  }
}

const doLogout = (req, res) => {
  req.session.destroy()
  res.redirect('/admin/login')
}

// Client
const viewLoginClient = (req, res) => {
  res.render('client/account', {
    error: null,
    message: null,
  })
}

const registerClient = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      repass
    } = req.body
    const checkEmail = await User.findOne({
      email: email
    }).lean()
    if (!checkEmail) {
      if (password !== repass) {
        return res.render('client/account', {
          error: "Password is incorrect",
          message: null,
        })
      }
      const hashPassword = await bcrypt.hash(password, 8)
      const createUser = new User({
        username: username,
        email: email,
        password: hashPassword,
      })
      if (createUser) {
        await createUser.save()
        req.session.guestId = createUser._id
        await Cart.create({
          user_id: createUser._id
        })
      }
      return res.redirect('/account')
    }
    res.render('client/account', {
      error: "Email already in use !",
    })
  } catch (error) {
    console.error(error);
  }
}

const loginClient = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body
    const checkUser = await LogIn(email, password)
    if (!checkUser) {
      return res.render('client/account', {
        error: "Email or password is incorrect"
      })
    }
    req.session.guestId = checkUser._id
    res.redirect('/')
  } catch (error) {
    console.error(error);
  }
}

const logoutClient = (req, res) => {
  req.session.destroy();
  res.redirect('/')
}

const viewChangePass = (req, res) => {
  res.render('client/change-pass')
}

const doChangePass = async (req, res) => {
  try {
    const guestId = req.session.guestId
    const {
      currentPass,
      newPass,
      confirmPass
    } = req.body
    const checkUser = await User.findById({
      _id: guestId
    }).lean()
    const comparePass = await bcrypt.compare(currentPass, checkUser.password)
    if (!comparePass) return res.redirect('/account/details')
    if (newPass !== confirmPass) return res.render('client/change-pass')
    const hashPass = await bcrypt.hash(confirmPass, 8)
    const updatePass = await User.findByIdAndUpdate({
      _id: guestId
    }, {
      password: hashPass
    })
    res.redirect('/account/details')
  } catch (error) {
    console.error(error);
  }
}

const doForgotPass = async (req, res) => {
  try {
    const {
      newPass,
      confirmPass,
      email
    } = req.body
    const checkUser = await User.findOne({
      email: email
    }).lean()
    if (!checkUser) return res.redirect('/account/forgot-password')
    if (newPass !== confirmPass) return res.render('client/change-pass')
    const hashPass = await bcrypt.hash(confirmPass, 8)
    const updatePass = await User.updateOne({
      email: email
    }, {
      $set: {
        password: hashPass
      }
    })
    req.session.guestId = checkUser._id
    res.redirect('/')
  } catch (error) {
    console.error(error);
  }
}

async function LogIn(email, password) {
  try {
    const user = await User.findOne({
      email: email
    }).lean()
    if (user) {
      const compare = await bcrypt.compare(password, user.password)
      if (compare) return user
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  viewLogin: viewLogin,
  doLogin: doLogin,
  doLogout: doLogout,
  viewLoginClient: viewLoginClient,
  registerClient: registerClient,
  loginClient: loginClient,
  logoutClient: logoutClient,
  viewChangePass: viewChangePass,
  doChangePass: doChangePass,
  doForgotPass: doForgotPass,
}