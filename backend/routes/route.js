const ScraperService = require('../services/scraper')

function setupScraperRoutes(app) {
    app.post('/api/scrape', async(req, res) => {
        try {
            const trends = await ScraperService.scrapeTwitterTrends();
            res.json(trends)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    })

    app.get('/api/trends/latest', async (req, res) => {
        try{
            const trends = await ScraperService.getLatestTrends();
            res.json(trends)
        } catch (error){
            res.status(500).json({ error: error.message })
        }
    })
}

module.exports = { setupScraperRoutes }