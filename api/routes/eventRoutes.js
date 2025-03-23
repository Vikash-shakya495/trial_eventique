const express = require("express");
const multer = require("multer");
const { createEvent, getEvents, getEventById, likeEvent } = require("../controllers/eventController");

const router = express.Router();
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, "uploads/");
   },
   filename: (req, file, cb) => {
      cb(null, file.originalname);
   },
});
const upload = multer({ storage });

router.post("/createEvent", upload.single("image"), createEvent);
router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/:eventId/like", likeEvent);

module.exports = router;