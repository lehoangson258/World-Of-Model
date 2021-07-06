const User = require("../models/User");
const bcrypt = require("bcrypt");
const Cart = require("../models/Cart");

const viewUser = async (req, res) => {
  try {
    const pagination = {
      page: req.params.page || 1,
      perPage: 10,
    };
    const adminId = req.session.adminId;
    const noPage = pagination.perPage * pagination.page - pagination.perPage;
    const checkUser = await User.findOne({
      _id: adminId,
      role: "SUPER_ADMIN",
    });
    const users = await User.find().skip(noPage).limit(pagination.perPage);
    const countUsers = await User.countDocuments();
    res.render("admin/user", {
      checkUser,
      users: users,
      current: pagination.page,
      pages: Math.ceil(countUsers / pagination.perPage),
    });
  } catch (error) {
    console.error(error);
  }
};

const viewAddUser = async (req, res) => {
  res.render("admin/add_user", {
    error: null,
    message: null,
  });
};

const newUsers = async (req, res) => {
  const user = {
    username: req.body.username,
    firstName: req.body.first_name,
    lastName: req.body.last_name,
    email: req.body.email,
    pass: req.body.password,
    rePass: req.body.repass,
    role: req.body.role,
  };

  if (!user.username || !user.email || !user.pass || !user.rePass) {
    return res.render("admin/add_user", {
      error: "Không được để trống dữ liệu !",
      message: null,
    });
  }

  if (user.pass.length < 5) {
    return res.render("admin/add_user", {
      error: "Mật khẩu phải từ 6 ký tự trở lên !",
      message: null,
    });
  }

  try {
    const checkEmail = await findEmail(user.email);
    if (!checkEmail) {
      if (user.pass === user.rePass) {
        const hash = await bcrypt.hash(user.pass, 8);
        const createUser = new User({
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: hash,
          role: user.role,
        });
        console.log(createUser);
        const result = await createUser.save();
        return res.render("admin/add_user", {
          message: "Thêm thành công",
          error: null,
        });
      } else {
        return res.render("admin/add_user", {
          error: "Password is incorrect",
          message: null,
        });
      }
    } else if (user.email == checkEmail.email) {
      return res.render("admin/add_user", {
        error: "Email already in use !  ",
        message: null,
      });
    }
  } catch (error) {
    return res.render("admin/add_user", {
      error: error.message,
      message: null,
    });
  }
};

const editUsers = async (req, res) => {
  const user = await User.findOne({
    _id: req.params.id,
  });
  res.render("admin/edit_user", {
    user: user,
    error: null,
    message: null,
  });
};

const updateUsers = async (req, res) => {
  try {
    const userId = req.params.id;
    const {
      username,
      firstName,
      lastName,
      email,
      password,
      newPass,
      confirmPass,
      role,
    } = req.body;
    const checkEmail = await User.distinct("_id", {
      email: email,
    });
    if (checkEmail[0] == undefined || userId === checkEmail[0].toString()) {
      const user = await User.findById(userId);
      const comparePass = await bcrypt.compare(password, user.password);
      if (comparePass && newPass === confirmPass) {
        const hashPass = await bcrypt.hash(newPass, 8);
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $set: {
              username: username,
              firstName: firstName,
              lastName: lastName,
              email: email,
              role: role,
              password: hashPass,
            },
          }
        );
        return res.render("admin/edit_user", {
          user: user,
          error: null,
          message: "Update password successful",
        });
      } else {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $set: {
              username: username,
              firstName: firstName,
              lastName: lastName,
              email: email,
              role: role,
            },
          }
        );
        return res.render("admin/edit_user", {
          user: user,
          error: null,
          message: "Update successful",
        });
      }
    }
    return res.render("admin/edit_user", {
      user: user,
      error: "Email already in use",
      message: null,
    });
  } catch (error) {
    console.error(error);
    return res.render("admin/edit_user", {
      user: user,
      error: "Failed to update",
      message: null,
    });
  }
};

const deleteUsers = async (req, res) => {
  try {
    const userId = req.params.id;
    const delUser = await User.deleteOne({
      _id: userId,
    });
    const delCart = await Cart.findOneAndDelete({ user_id: userId });
    res.redirect("/admin/user");
  } catch (error) {
    console.log(error);
  }
};

// Client

const viewAccountDetails = async (req, res) => {
  try {
    const dataGuest = await User.findById(req.session.guestId).lean();
    res.render("client/account-details", {
      user: dataGuest,
    });
  } catch (error) {
    console.error(error);
  }
};

const doAccountDetails = async (req, res) => {
  try {
    const guestId = req.session.guestId;
    const { firstName, lastName, displayName, email, phoneNumber, bankName, bankNumber } = req.body;
    const checkEmail = await User.distinct("_id", {
      email: email,
    });
    if (checkEmail[0] == undefined || guestId === checkEmail[0].toString()) {
      const update = await User.findByIdAndUpdate(
        {
          _id: guestId,
        },
        {
          firstName: firstName,
          lastName: lastName,
          username: displayName,
          email: email,
          phoneNumber: phoneNumber,
          bankName: bankName,
          bankNumber: bankNumber
        }
      );
      return res.redirect("/account/details");
    }
    res.redirect("/account/details");
  } catch (error) {
    console.error(error);
  }
};

const viewAddress = async (req, res) => {
  try {
    const guestId = req.session.guestId;
    const userData = await User.findById({
      _id: guestId,
    });
    res.render("client/address", {
      user: userData,
    });
  } catch (error) {
    console.error(error);
  }
};

const doAddress = async (req, res) => {
  try {
    const guestId = req.session.guestId;
    const { company, city, district, ward, details } = req.body;
    const updateData = await User.updateOne(
      {
        _id: guestId,
      },
      {
        address: {
          details: details,
          company: company,
          city: city,
          district: district,
          ward: ward,
        },
      }
    );
    res.redirect("/account/details/address");
  } catch (error) {
    console.error(error);
  }
};

const findEmail = async (email) => {
  const userEmail = await User.findOne({
    email,
  }).lean();
  return userEmail;
};

// async function findIdUserUpdate (id, element) {
//   const test = await User.findByIdAndUpdate({_id: id},{element})
//   return test
// }

module.exports = {
  viewUser: viewUser,
  viewAddUser: viewAddUser,
  newUsers: newUsers,
  editUsers: editUsers,
  updateUsers: updateUsers,
  deleteUsers: deleteUsers,
  viewAccountDetails: viewAccountDetails,
  doAccountDetails: doAccountDetails,
  viewAddress: viewAddress,
  doAddress: doAddress,
};
