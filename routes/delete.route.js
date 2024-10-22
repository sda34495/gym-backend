const express = require("express");
const { deleteResource } = require("../controllers/GenralController");

const router = express.Router();

router.post("/resource", deleteResource);


module.exports = router;
