require('dotenv').config();

class ProxyService {
    constructor(){
        this.proxyList = process.env.PROXY_LIST.split(',');
        this.currentIndex = 0;
    }

    getNextProxy() {
        const proxy = this.proxyList[this.currentIndex]
        this.currentIndex = (this.currentIndex + 1) % this.proxyList.length;
        return {
            host: proxy.split(':')[0],
            port: proxy.split(':')[1],
            username: process.env.PROXY_USERNAME
        }
    }
}

module.exports = new ProxyService();