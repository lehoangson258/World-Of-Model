// Admin
const checkLogin = (req, res, next) => {
    if (req.session.adminId && req.session.roleAdmin !== 'MEMBER') {
        return res.redirect('/admin/dashboard')
    }
    next();
}

const checkAdmin = (req, res, next) => {
    if (!req.session.adminId) {
        return res.redirect('/admin/login')
    }
    if (req.session.roleAdmin === 'MEMBER') {
        return res.redirect('/admin/login')
    }
    next();
}

// Client
const checkLoginClient = (req, res, next) => {
    if (req.session.guestId) return res.redirect('/')
    next();
}

const checkAccount = (req, res, next) => {
    if (!req.session.guestId) return res.redirect('/account')
    next();
}
module.exports = {
    checkLogin: checkLogin,
    checkAdmin: checkAdmin,
    checkLoginClient: checkLoginClient,
    checkAccount: checkAccount
}