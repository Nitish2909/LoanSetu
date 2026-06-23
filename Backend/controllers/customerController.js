const Customer = require('../models/Customer');

const createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);

    res.status(201).json({
      message: 'Application submitted',
      id: customer._id,
    });
  } catch (e) {
    res.status(500).json({
      message: 'Server error',
      error: e.message,
    });
  }
};

const getCustomers = async (req, res) => {
  try {
    const filter = {};

    if (req.query.name) {
      filter.name = {
        $regex: req.query.name,
        $options: 'i',
      };
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const customers = await Customer.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    res.json(customers);
  } catch (e) {
    res.status(500).json({
      message: 'Server error',
      error: e.message,
    });
  }
};

const getCustomer = async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    return res.status(404).json({
      message: 'Customer not found',
    });
  }

  res.json(customer);
};

const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!customer) {
      return res.status(404).json({
        message: 'Customer not found',
      });
    }

    res.json({
      message: 'Updated',
      customer,
    });
  } catch (e) {
    res.status(500).json({
      message: 'Server error',
      error: e.message,
    });
  }
};

const deleteCustomer = async (req, res) => {
  const customer = await Customer.findByIdAndDelete(
    req.params.id
  );

  if (!customer) {
    return res.status(404).json({
      message: 'Customer not found',
    });
  }

  res.json({
    message: 'Customer deleted',
  });
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer
};