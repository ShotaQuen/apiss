async function alquran(nomor) {
    try {
        const response = await axios.get(`https://equran.id/api/v2/surat/${nomor}`)
        return response.data.data
    } catch (error) {
        return error.response?.data || error.message || "Unknown error"
    }
}

router.get("/alquran", async (req, res) => {
  try {
    const { nomor } = req.query;

    if (!nomor) {
      return res.status(400).json({
        status: false,
        error: "Nomor parameter is required"
      });
    }

    const result = await alquran(nomor);

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

router.example_response = "1";
module.exports = router;