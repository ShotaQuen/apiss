const { tiktokAll } = require('../../../scrape/download.js')

router.get("/tiktok", async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        status: false,
        error: "URL parameter is required"
      });
    }

    const result = await tiktokAll(url);

    res.json({
      status: true,
      creator: "BerakNews",
      result
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      error: error
    });
  }
});

router.example_response = "https://vt.tiktok.com/ZSDy5LcJP/";
module.exports = router;