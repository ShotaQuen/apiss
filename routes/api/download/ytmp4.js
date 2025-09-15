const { ytmp4 } = require('../../../scrape/download.js')

router.get("/ytmp4", async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        status: false,
        error: "URL parameter is required"
      });
    }

    const result = await ytmp4(url);

    res.json({
      status: true,
      creator: "BerakNews",
      result: {
        result
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      error: error
    });
  }
});

router.example_response = "https://youtube.com/watch?v=mkkB1EdEjbA";
module.exports = router;