const { Builder, By, until } = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const proxyService = require('./proxy')
const TrendModel = require('../models/Trend')

class ScraperService {
    async scrapeTwitterTrends(){
        let driver;
        const proxy = proxyService.getNextProxy()

        try {
            const options = new chrome.Options();
            options.addArguments(`--proxy-server=http://${proxy.host}:${proxy.port}`)

            const proxyAuth = {
                proxyType: 'manual',
                httpProxy: `${proxy.host}:${proxy.port}`,
                sslProxy: `${proxy.host}: ${proxy.port}`,
                proxyAuthconfigUrl: `http://${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}`
            }

            options.setUserPreferences({ proxy: proxyAuth })

            driver = await new Builder()
                .forBrowser('chrome')
                .setChromeOptions(options)
                .build()

            // Navigate to Twitter login
            await driver.get('https://twitter.com/i/flow/login')

            // Wait for username field and enter username
            await driver.wait(until.elementLocated(By.css('input[autocomplete="username"]')), 100000)
            await driver.findElement(By.css('input[autocomplete="username"]')).sendKeys(process.env.TWITTER_USERNAME)

            // Find and click the Next button
            const nextButton = await driver.wait(
                until.elementLocated(By.xpath('//div[@dir="ltr"]//span[contains(text(),"Next")]')),
                100000
            );
            await driver.executeScript("arguments[0].click();", nextButton);

            await driver.wait(
                until.elementLocated(By.css('input[autocomplete="on"]')),
                100000
            );
            await driver.findElement(By.css('input[autocomplete="on"]')).sendKeys(process.env.TWITTER_EMAIL)

            const nextButton2 = await driver.wait(
                until.elementLocated(By.xpath('//div[@dir="ltr"]//span[contains(text(),"Next")]')),
                100000
            );

            await driver.executeScript("arguments[0].click();", nextButton2);

            // Wait for password field and enter password
            const passwordInput = await driver.wait(
                until.elementLocated(By.css('input[name="password"]')),
                100000
            );
            await passwordInput.sendKeys(process.env.TWITTER_PASSWORD);

            // Click the Login button
            const loginButton = await driver.wait(
                until.elementLocated(By.xpath('//div[@dir="ltr"]//span[contains(text(),"Log in")]')),
                100000
            );
            await driver.executeScript("arguments[0].click();", loginButton);

           

            await driver.wait(until.elementLocated(By.css('[data-testid="trend"]')), 100000)

            const trendElements = await driver.findElements(By.css('[data-testid="trend"]'));
            const trends = [];

            for (let i = 0; i< 5; i++){
                const trendText = await trendElements[i].findElement(By.css('span')).getText();
                trends.push(trendText);
            }

            const trendData = {
                nameoftrend1: trends[0],
                nameoftrend2: trends[1],
                nameoftrend3: trends[2],
                nameoftrend4: trends[3],
                nameoftrend5: trends[4],
                ipAddress: `${proxy.host}:${proxy.port}`
            }

            const trend = new TrendModel(trendData);
            await trend.save();

            return trendData;
        } catch (error){
            console.error('Error:', error);
            throw error;
        } finally {
            if (driver){
                await driver.quit();
            }
        }
    }
    async getLatestTrends(){
        return await TrendModel.findOne().sort({ scrapeTime: -1 });
    }
}

module.exports = new ScraperService();