const axios = require('axios');
const cheerio = require('cheerio');

async function nerdfonts() {
    try {
        const { data } = await axios.get('https://www.nerdfonts.com/font-downloads');
        const $ = cheerio.load(data);
        const result = [];
        
        $('div.item').each((_, rynn) => {
            const name = $(rynn).find('span.nerd-font-invisible-text').text().trim();
            const textContent = $(rynn).find('div').first().text();
            const version = textContent.match(/Version:\s*([^\n\r]+)/)[1].trim() || null;
            const info = textContent.match(/Info:\s*([^\n\r]+)/)[1].trim() || null;
            const preview_image = 'https://www.nerdfonts.com' + $(rynn).find('a.font-preview').attr('style').match(/background-image\s*:\s*url\s*\(\s*['"]?([^'"]+)['"]?\s*\)/i)[1] || null;
            const preview_url = $(rynn).find('a.nf-oct-link_external').attr('href') || null;
            const download_url = $(rynn).find('a.nf-fa-download').attr('href');
            
            if (name && download_url) {
                result.push({
                    name,
                    version,
                    info,
                    preview_image,
                    preview_url,
                    download_url
                });
            }
        });
        
        return result
    } catch (error) {
        throw new Error(error.message);
    }
}

router.get("/nerdfonts", async (req, res) => {
  try {
    const result = await nerdfonts();

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

router.example_response = "-";
module.exports = router;