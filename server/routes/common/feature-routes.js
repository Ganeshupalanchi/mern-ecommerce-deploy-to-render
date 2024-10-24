const express = require("express");
const {
  getFeatureImage,
  addFeatureImage,
  deleteFeatureImage,
} = require("../../controllers/common/feature-controller");
const router = express.Router();

router.post("/add", addFeatureImage);
router.get("/get", getFeatureImage);
router.delete("/delete/:featureId", deleteFeatureImage);

module.exports = router;