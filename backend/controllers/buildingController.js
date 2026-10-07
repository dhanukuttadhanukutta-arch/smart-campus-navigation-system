const Building = require("../models/Building");

// Add Building
const addBuilding = async (req, res) => {
  try {
    const building = new Building(req.body);
    await building.save();
    res.status(201).json(building);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Buildings
const getBuildings = async (req, res) => {
  try {
    const buildings = await Building.find();
    res.status(200).json(buildings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addBuilding,
  getBuildings,
};