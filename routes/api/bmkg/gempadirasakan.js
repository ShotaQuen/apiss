async function bmkg() {
  try {
    const res = await axios.get(`https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json`)
    return res.data
  } catch (err) {
    console.error(err.message)
    return null
  }
}

router.get("/gempadirasakan", async (req, res) => {
  try {
    const result = await bmkg();

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

router.example_response = "";
module.exports = router;