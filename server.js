//apps and api's
var express = require('express')
var app = express()
//Keys: VP7SVL5I3UWGXQNU || P4RNEFDSU4NQQOWK || XZB1HH3M06FHSKMX
const alpha = require('alphavantage')({ key: 'P4RNEFDSU4NQQOWK' })
const axios = require('axios')

app.listen(3000, function(){
    console.log('==Server Running')
})

app.use(express.static('static'))

app.get('/', function(req, res, next){
    res.status(200).sendFile(__dirname+'/static/index.html')
})

app.get('/home', async function(req, res, next){
    const url = 'https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=XZB1HH3M06FHSKMX'
    axios.get(url, { 
        headers: {'User-Agent': 'axios'} 
    }).then(response => { 
        res.json(response.data)
    }).catch(error => { 
        console.error('Error:', error)
    })
})

app.get('/track', function(req, res, next){
    res.status(200).sendFile(__dirname+'/static/track.html')
    next()
})

//used for searching for spesific ticker
app.get('/track/:ticker/:time', async function(req, res) {
    var ticker = req.params.ticker
    var time = req.params.time
   
        try {
            if (time === '1d'){
                const data = await alpha.data.intraday(ticker, 'compact', 'json', '5min')
                const parsedData = trimDataToRange(data, "Time Series (5min)", time)
                res.json(parsedData)
            }
            else if(time === '5d') {
                const data = await alpha.data.intraday(ticker, 'compact', 'json', '30min')
                const parsedData = trimDataToRange(data, "Time Series (30min)", time)
                res.json(parsedData)
            } else {
                const data = await alpha.data.daily(ticker, 'full', 'json')
                const parsedData = trimDataToRange(data, "Time Series (Daily)", time)
                res.json(parsedData)
            }
        } catch (error) {
            console.error(error)
            res.status(500).send('Error fetching data')
        }
})

app.get('*', function(req, res, next){
    res.status(404).sendFile(__dirname+'/static/404.html')
})

//sorts data into time zone and parsed data to only have date and close price
function trimDataToRange(json, dataInterval, time) {
    const timeSeries = json[dataInterval]
    const filteredData = []
    
    // Get the most recent datetime available in the data
    const mostRecentDatetime = Object.keys(timeSeries)[0]
    const mostRecentDate = new Date(mostRecentDatetime)

    let thresholdDate
    // Calculate the date thresholds based on the range
    switch (time) {
        case '1d':
            thresholdDate = new Date(mostRecentDate)
            thresholdDate.setDate(thresholdDate.getDate() - 1)
            break
        case '5d':
            thresholdDate = new Date(mostRecentDate)
            thresholdDate.setDate(thresholdDate.getDate() - 5)
            break
        case '1mo':
            thresholdDate = new Date(mostRecentDate)
            thresholdDate.setMonth(thresholdDate.getMonth() - 1)
            break
        case '6mo':
            thresholdDate = new Date(mostRecentDate)
            thresholdDate.setMonth(thresholdDate.getMonth() - 6)
            break
        case '1y':
            thresholdDate = new Date(mostRecentDate)
            thresholdDate.setFullYear(thresholdDate.getFullYear() - 1)
            break
        case 'all':
            thresholdDate = new Date('1900-01-01')
            break
        default:
            console.error('Invalid range specified')
            return []
    }

    // Filter data based on the calculated threshold date
    for (const dateTime in timeSeries) {
        const currentDatetime = new Date(dateTime)
        if (currentDatetime >= thresholdDate) {
            const formattedDate = formatDateTime(dateTime, time)
            filteredData.push({
                date: formattedDate,
                close: parseFloat(timeSeries[dateTime]["4. close"])
            })
        }
    }

    filteredData.reverse()
    return filteredData
}

//ttims up the dates of the data to only the relevant data 
function formatDateTime(dateTime, timeRange) {
    let formattedDate
    switch (timeRange) {
        case '1d':
            const timePart = dateTime.split(' ')[1]
            formattedDate = convertTo12HourFormat(timePart)
            break
        case '5d':
            const [year, month, day, hour, minute] = dateTime.split(/[- :]/)
            const formattedTime = convertTo12HourFormat(`${hour}:${minute}`)
            formattedDate = `${month}-${day} ${formattedTime}`
            break
        case '1m':
        case '6m':
            [year, month, day] = dateTime.split('-')
            formattedDate = `${year}-${month}`
            break
        case '1y':
        case 'all':
            formattedDate = dateTime.split(' ')[0]
            break
        default:
            formattedDate = dateTime 
    }
    return formattedDate
}

function convertTo12HourFormat(time) {
    const [hour, minute] = time.split(':');
    let period = 'AM';
    let hour12 = parseInt(hour, 10);
    
    if (hour12 >= 12) {
        period = 'PM';
        if (hour12 > 12) {
            hour12 -= 12;
        }
    } else if (hour12 === 0) {
        hour12 = 12;
    }
    
    return `${hour12}:${minute} ${period}`;
}

