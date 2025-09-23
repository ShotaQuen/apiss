async function cuaca(kode) {
  try {
    const res = await axios.get(`https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${kode}`)
    const data = res.data

    if (!data || !data.data || !data.data[0] || !data.data[0].cuaca) {
      throw new Error("Data cuaca tidak tersedia")
    }

    let ramalan = data.data[0].cuaca.flat()

    // kembalikan data lengkap
    return {
      lokasi: data.lokasi,
      detail_lokasi: data.data[0].lokasi,
      ramalan
    }
  } catch (err) {
    console.error("Gagal ambil cuaca:", err.message)
    return null
  }
}

router.get("/cuaca", async (req, res) => {
  try {
    const { kode } = req.query;

    if (!kode) {
      return res.status(400).json({
        status: false,
        error: "Kode wilayah harus ada"
      });
    }

    const result = await cuaca(url);

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

router.example_response = "31.71.03.1001";
module.exports = router;