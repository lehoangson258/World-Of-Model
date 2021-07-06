const Category = require("../models/Category");

const indexCategory = async (req, res) => {
  const pagination = {
    page: req.params.page || 1,
    perPage: 10,
  };
  const noPage = pagination.perPage * pagination.page - pagination.perPage;
  try {
    const categories = await Category.find()
      .skip(noPage)
      .limit(pagination.perPage);
    const countUsers = await Category.countDocuments();
    res.render("admin/category", {
      categories: categories,
      current: pagination.page,
      pages: Math.ceil(countUsers / pagination.perPage),
    });
  } catch (error) {
    console.log(error);
  }
};

const addCategory = (req, res) => {
  res.render("admin/add_category", {
    error: null,
    message: null,
  });
};

const newCategory = async (req, res) => {
  const reqData = req.body.cat_name;

  const incorrect = await findCategory(reqData);
  try {
    if (!incorrect) {
      const createCategory = new Category({
        name: reqData,
      });
      const saveCategory = await createCategory.save();
      res.render("admin/add_category", {
        error: null,
        message: "Create Success",
      });
    } else if (reqData == incorrect.name) {
      res.render("admin/add_category", {
        error: "Brand already in use",
        message: null,
      });
    }
  } catch (error) {
    res.render("admin/add_category", {
      error: error.message,
      message: null,
    });
  }
};

const editCategory = async (req, res) => {
  const dataCategory = await findIdCategory(req.params.id);
  res.render("admin/edit_category", {
    category: dataCategory,
    error: null,
    message: null,
  });
};

const updateCategory = async (req, res) => {
  try {
    const brandId = req.params.id;
    const { brandName, status } = req.body;
    const checkBrand = await Category.distinct("_id", {
      name: brandName,
    });
    if (checkBrand[0] == undefined || brandId === checkBrand[0].toString()) {
      const updateCategory = await Category.findByIdAndUpdate(
        {
          _id: brandId,
        },
        {
          name: brandName,
          status: status,
        }
      );
      const updateData = await findIdCategory(brandId);
      res.render("admin/edit_category", {
        category: updateData,
        error: null,
        message: "Update Success",
      });
    } else if (brandName === incorrect.name) {
      res.render("admin/edit_category", {
        category: dataCategory,
        error: "Brand already in use",
        message: null,
      });
    }
  } catch (error) {
    res.render("admin/edit_category", {
      category: dataCategory,
      error: error.message,
      message: null,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const idCategory = await Category.deleteOne({
      _id: req.params.id,
    });
    res.redirect("/admin/category");
  } catch (error) {
    console.log(error);
  }
};

const findCategory = async (category) => {
  const categoryTitle = await Category.findOne({
    name: category,
  }).lean();
  return categoryTitle;
};

const findIdCategory = async (idCategory) => {
  const categoryId = await Category.findOne({
    _id: idCategory,
  }).lean();
  return categoryId;
};

module.exports = {
  indexCategory: indexCategory,
  addCategory: addCategory,
  newCategory: newCategory,
  editCategory: editCategory,
  updateCategory: updateCategory,
  deleteCategory: deleteCategory,
};
