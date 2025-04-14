//will be used to send user to tracking page when they enter a ticker symbol
//will also have graph funtions for the small home page graphs

//need to make sure user puts valid input

var button = document.getElementById('search-btn')

button.addEventListener('click', function(event) { 
        event.preventDefault(); // Prevent default form submission 
        
        // Get the stock symbol and time interval from the input fields 
        var symbol = document.getElementById('symbol-input').value.trim().toUpperCase(); 
        var time = '1d'

        if(!symbol){
            alert('enter a ticker symbol')
        }else{
            window.location.href = 'track.html?symbol=' + symbol + '&time=' + time
        }
    })
    
    
document.getElementById('top1').addEventListener('click', function() {
    handleTopStockClick('top1')
})
document.getElementById('top2').addEventListener('click', function() {
    handleTopStockClick('top2')
})
document.getElementById('top3').addEventListener('click', function() {
    handleTopStockClick('top3')
})

window.addEventListener('load', async function(event) {
    var top1Text = document.getElementById('top1')
    var top2Text = document.getElementById('top2')
    var top3Text = document.getElementById('top3')

    var top1PCText = document.getElementById('top1-pc')
    var top2PCText = document.getElementById('top2-pc')
    var top3PCText = document.getElementById('top3-pc')
    
    try {
        const response = await fetch('/home')
        if (!response.ok) { 
            throw new Error(`HTTP error! Status: ${response.status}`)
        } 
        
        var data = await response.json()
        var popTickers = data['most_actively_traded']
        
        var top1 = popTickers[0]
        var top2 = popTickers[1]
        var top3 = popTickers[2]


        top1Text.textContent = top1.ticker
        top2Text.textContent = top2.ticker
        top3Text.textContent = top3.ticker

        top1PCText.textContent = top1.change_percentage
        top2PCText.textContent = top2.change_percentage
        top3PCText.textContent = top3.change_percentage

        changeColorBasedOnPercentage(top1PCText, top1.change_percentage)
        changeColorBasedOnPercentage(top2PCText, top2.change_percentage)
        changeColorBasedOnPercentage(top3PCText, top3.change_percentage)
    } catch (error) {
        console.error('Error fetching data:', error)

        top1Text.textContent = 'Error'
        top2Text.textContent = 'Fetching'
        top3Text.textContent = 'Data'
    }
});

function handleTopStockClick(slotId) {
    var slot = document.getElementById(slotId)
    var symbol = slot.innerText
    window.location.href = 'track.html?symbol=' + symbol + '&time=1d'
}

function changeColorBasedOnPercentage(element, percentage) { 
    if (parseFloat(percentage) > 0) { 
        element.style.color = 'green'
    } else 
    { 
        element.style.color = 'red'
    }
}
