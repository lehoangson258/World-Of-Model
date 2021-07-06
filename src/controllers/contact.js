const ContactModels = require('../models/Contact');

const viewAdminContact = async (req, res) => {
  try {
    const pagination = {
      page: req.params.page || 1,
      perPage: 10,
    }
    const noPage = (pagination.perPage * pagination.page) - pagination.perPage

    const contact = await ContactModels.find().skip(noPage).limit(pagination.perPage)

    const countContact = await ContactModels.countDocuments()
    res.render('admin/contact', {
      contact: contact,
      current: pagination.page,
      pages: Math.ceil(countContact / pagination.perPage),
    })
  } catch (error) {
    console.error(error);
  }
}

// Client
const viewContact = (req, res) => {
  res.render('client/contact')
}

const doContact = async (req, res) => {
  const {name, email, phone, subject, message} = req.body
  const createContact = new ContactModels({
    name: name,
    phone: phone,
    email: email,
    subject: subject,
    message: message
  })
  if (createContact) await createContact.save()
  res.render('client/contact')
}
module.exports = {
  viewContact: viewContact,
  doContact: doContact,
  viewAdminContact: viewAdminContact
}