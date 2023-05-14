import Payment from "../mongodb/models/payment.js";

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    res.status(200).json(payment);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const createPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(payment);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    res.status(200).json(payment);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
};
