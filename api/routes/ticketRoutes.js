const express = require("express");
const { createTicket, getTickets, getUserTickets, deleteTicket } = require("../controllers/ticketController");

const router = express.Router();

router.post("/", createTicket);
router.get("/", getTickets);
router.get("/user/:userId", getUserTickets);
router.delete("/:id", deleteTicket);

module.exports = router;