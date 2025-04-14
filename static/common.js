
  
  //calls the search page on the search and waits for data from api , then calls graph function
    async function getData(symbol, time) { 
      if(!symbol || !time) {
      var symbol = document.getElementById('symbol-input').value.trim().toUpperCase()
      var time = document.querySelector('input[name="interval"]:checked').value

      if(!symbol){
        alert('enter a ticker symbol')
        return
      }
      }
      
      var api_url = `/track/${symbol}/${time}`
  
       try { 
        const response = await fetch(api_url)
        const data = await response.json();
        
        if (!response.ok) { 
          const errorMessage = data["Error Message"] || `HTTP error! Status: ${response.status}`
          throw new Error(errorMessage)
	  return
        } 

        console.log(data)
        graphData(data)

        var percentChangeText = document.getElementById('percent-change')
        var percentChange = calcPercentChange(data)
        handlePercentChangeStyle(percentChange)
        if(percentChange > 0) {
          percentChangeText.textContent = '+'+percentChange+'%'
        }
        else {
        percentChangeText.textContent = percentChange+'%'
        }
        //debug
        console.log(percentChange)
        
        data.reverse()
        var currentPrice = document.getElementById('current-price')
        currentPrice.textContent = '$'+data[0].close
        console.log('$'+data[0].close)
      } 
      catch (error) { 
        console.error('Error fetching data:', error)
        alert('An error has occured try again or enter a different symbol')
     } 
    }
  
  //for chart function - testing graph refresh
  let chartInstance = null
  
  //charting function - needs customization
  async function graphData(data) {  
    if(chartInstance) {
      chartInstance.destroy()
    }
     chartInstance =  new Chart(
        document.getElementById('main-graph'),
        {
          type: 'line',
          data: {
            labels: data.map(row => row.date),
            datasets: [
              {
                label: 'Price',
                data: data.map(row => row.close),
                pointRadius: 0,
                borderColor: '#f59eff'
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins:{
              legend:{
                display: false
              }
            },
              scales:{
                x:{
                  grid:{
                    display: false
                  }
                },
                  y: {
                    grid: {
                      display: false
                    }
                  }
              }
            
          }
        }
      )
    }

function calcPercentChange(json){
  var startPrice = json[0].close
  var endPrice = json[json.length -1].close

  var percentChange = ((endPrice-startPrice)/startPrice)*100
  return percentChange.toFixed(2)
}

function handlePercentChangeStyle(percentChange){
  var percentChangeText = document.getElementById('percent-change')
  if(percentChange>=0){
    percentChangeText.style.color = 'green'
  }
  else{
    percentChangeText.style.color = 'red'
  }
}


  
  
