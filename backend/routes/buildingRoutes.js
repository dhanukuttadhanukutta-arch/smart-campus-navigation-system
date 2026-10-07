const express = require("express");
const router = express.Router();

const {
  addBuilding,
  getBuildings,
} = require("../controllers/buildingController");

// Add Building
router.post("/", addBuilding);

// Get All Buildings
router.get("/", getBuildings);

module.exports = router;