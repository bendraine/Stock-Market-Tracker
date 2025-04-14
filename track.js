//event listener for when the form is submited 
var form = document.getElementById('symbol-form').addEventListener('submit', async function(event){
  event.preventDefault()
  try {
    await getData();
  } catch (error) {
    console.log('Error Gathering Data')
  }
})

var intervalRadios = document.querySelectorAll('input[name="interval"]');
intervalRadios.forEach(radio => {
  radio.addEventListener('change', async function(event) {
    var symbol = document.getElementById('symbol-input').value;
    var time = event.target.value;

    // Make sure symbol and time are valid before calling getData
    if (symbol && time) {
      try {
        await getData(symbol, time)
      } catch (error) {
        console.log('Error Gathering Data')
      }
    }
  });
});

window.addEventListener('load', async function(event) {
  // Get the query parameters from the URL
  const urlParams = new URLSearchParams(window.location.search)
  const symbol = urlParams.get('symbol')
  const time = urlParams.get('time')

  if (symbol && time) {
    try {
      await getData(symbol, time);
    } catch (error) {
      console.log('Error Gathering Data')
    }
  }

  document.getElementById('symbol-input').value = urlParams.get('symbol')
})