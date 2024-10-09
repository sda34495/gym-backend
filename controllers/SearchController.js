const Member = require("../models/Member"); // Assuming Member model is in models folder
const Coach = require("../models/Coach"); // Assuming Coach model is in models folder

const searchFighters = async (req, res) => {
  try {
    const {
      sport, // Sport filter
      class: classType, // Class filter
      minWeight, // Minimum weight
      maxWeight, // Maximum weight
      minHeight, // Minimum height
      maxHeight, // Maximum height
      homeTown, // Home town filter
      lat, // Latitude for location-based filtering
      lon, // Longitude for location-based filtering
      within, // Distance in miles
    } = req.query;

    const query = {
      isActive: true,
      isDeleted: false,
    };

    // If sport filter is present
    if (sport) {
      query.sports = {
        $elemMatch: {
          sport: sport,
        },
      };
    }

    // If class filter is present
    if (classType) {
      query.sports = {
        ...query.sports,
        $elemMatch: {
          ...query.sports.$elemMatch,
          class: classType,
        },
      };
    }

    // Filter by hometown
    if (homeTown) {
      query.homeTown = homeTown;
    }

    // Filter by weight range
    if (minWeight || maxWeight) {
      query.weight = {};
      if (minWeight) {
        query.weight.$gte = parseInt(minWeight, 10);
      }
      if (maxWeight) {
        query.weight.$lte = parseInt(maxWeight, 10);
      }
    }

    // Filter by height range
    if (minHeight || maxHeight) {
      query.height = {};
      if (minHeight) {
        query.height.$gte = parseInt(minHeight, 10);
      }
      if (maxHeight) {
        query.height.$lte = parseInt(maxHeight, 10);
      }
    }

    // If location (lat, lon) and distance (within) filter is present
    if (lat && lon && within) {
      const longitude = parseFloat(lon);
      const latitude = parseFloat(lat);
      query.location = {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], parseInt(within) / 3963.2], // Radius in miles
        },
      };
    }

    // Fetch fighters based on the constructed query
    const fighters = await Member.find(query);
    res.status(200).json(fighters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const searchCoach = async (req, res) => {
  try {
    const {
      role, // Role filter (e.g., head coach, assistant coach)
      sport, // Sport filter
      experienceYears, // Minimum years of experience
      experienceMonths, // Minimum months of experience
      weightMin, // Minimum weight filter
      weightMax, // Maximum weight filter
      heightMin, // Minimum height filter
      heightMax, // Maximum height filter
      lat,
      lon,
      within, // Distance in miles
    } = req.query;

    const query = {}; // Query base to find active, non-deleted coaches

    // If role filter is present
    if (role) {
      query.role = role; // Assumes `role` is a property in schema
    }

    if (sport) {
      query.sport = sport; // Assumes `sport` is a property in schema
    }

    if (experienceYears) {
      query["experience.years"] = { $gte: parseInt(experienceYears, 10) };
    }
    if (experienceMonths) {
      query["experience.months"] = { $gte: parseInt(experienceMonths, 10) };
    }

    if (weightMin || weightMax) {
      query.weight = {};
      if (weightMin) {
        query.weight.$gte = parseInt(weightMin, 10);
      }
      if (weightMax) {
        query.weight.$lte = parseInt(weightMax, 10);
      }
    }

    if (heightMin || heightMax) {
      query.height = {};
      if (heightMin) {
        query.height.$gte = parseInt(heightMin, 10);
      }
      if (heightMax) {
        query.height.$lte = parseInt(heightMax, 10);
      }
    }

    // If location (lat, lon) and distance (within) filter is present
    if (lat && lon && within) {
      const longitude = parseFloat(lon);
      const latitude = parseFloat(lat);
      query.location = {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], parseInt(within) / 3963.2], // Radius in miles
        },
      };
    }

    const coaches = await Coach.find(query);
    res.status(200).json(coaches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { searchFighters, searchCoach };
