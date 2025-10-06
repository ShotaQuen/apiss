const axios = require('axios')
const cheerio = require('cheerio')

async function mplrank() {
  try {
    const { data } = await axios.get('https://id-mpl.com/');
    const $ = cheerio.load(data);
    const mpl = [];

    $('tr').each((index, element) => {
      const rank = $(element).find('.team-rank').text().trim();
      const logo = $(element).find('.team-logo img').attr('src');
      const alt = $(element).find('.team-logo img').attr('alt');
      const shortName = $(element).find('.team-name span.d-lg-none').text().trim();
      const fullName = $(element).find('.team-name span.d-none.d-lg-block').text().trim();

      if (rank) { // biar gak masuk data kosong
        mpl.push({
          rank: Number(rank),
          alt,
          shortName,
          fullName,
          logo
        });
      }
    });

    return mpl;
  } catch (error) {
    console.error('Error fetching updates:', error.message);
    return [];
  }
}

router.get("/mpl", async (req, res) => {
  try {
    const result = mplrank()
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