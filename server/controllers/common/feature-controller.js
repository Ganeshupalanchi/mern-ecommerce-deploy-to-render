const Feature = require("../../models/Feature");

const addFeatureImage = async (req, res) => {
  try {
    const { image } = req.body;
    const featureImages = new Feature({ image });
    await featureImages.save();
    res.status(201).json({ success: true, data: featureImages });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};
const getFeatureImage = async (req, res) => {
  try {
    const images = await Feature.find();
    res.status(200).json({ success: true, data: images });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const deleteFeatureImage = async (req, res) => {
  try {
    const { featureId } = req.params;
    // console.log(featureId);

    const deletedFeatureImageId = await Feature.findByIdAndDelete(featureId);
    if (deletedFeatureImageId) {
      return res
        .status(200)
        .json({ success: true, message: "Feature image deleted." });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Image not found." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = { addFeatureImage, getFeatureImage, deleteFeatureImage };
