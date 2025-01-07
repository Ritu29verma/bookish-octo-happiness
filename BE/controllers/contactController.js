const ContactMessage = require('../models/ContactMessage');

exports.saveMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    await ContactMessage.create({ name, email, message });

    res.status(201).json({ message: 'Message saved successfully' });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllMessages = async function (req, res) {
  try {
    const messages = await ContactMessage.findAll({
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ messages: messages });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve messages.', error: error });
  }
};
