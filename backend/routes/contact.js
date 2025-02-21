const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact"); // Import Contact model
const sendMail = require("../middlewares/sendMail"); // Import email middleware

// POST /api/contact
router.post("/", async (req, res) => {
  const { name, email, message } = req.body; // Extract data from the request

  const newContact = new Contact({ name, email, message }); // Create new contact entry

  try {
    const savedContact = await newContact.save(); // Save to the database
    await sendMail(email, message); // Send the email
    res.status(200).json({savedContact, message: "Message sent successfully!" });
  } catch (err) {
    console.error("Error in contact route:", err); // Log any errors
    res.status(500).json({ message: "Failed to send the message. Please try again." });
  }
});

module.exports = router;

