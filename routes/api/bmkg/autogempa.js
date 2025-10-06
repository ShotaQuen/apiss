async function bmkg() {
  try {
    const res = await axios.get(`https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json`)
    const data = res.data

    if (!data || !data.data || !data.data[0] || !data.data[0].cuaca) {
      throw new Error("Data cuaca tidak tersedia")
    }

    return data
  } catch (err) {
    console.error("Gagal ambil cuaca:", err.message)
    return null
  }
}

router.get("/autogempa", async (req, res) => {
  try {
    const result = await bmkg(kode);

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

module.exports = router;