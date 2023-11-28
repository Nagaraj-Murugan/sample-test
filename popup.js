
document.addEventListener('DOMContentLoaded', function () {
  var getSummaryButton = document.getElementById('getSummaryButton');
  var summaryResult = document.getElementById('summaryResult');
  var loadingSpinner = document.getElementById('loadingSpinner');
  var errorMessage = document.getElementById('errorMessage');

  getSummaryButton.addEventListener('click', function () {
    var moodText = prompt('Enter mood text (happy, sad, angry, scary, excited):');

    if (!moodText) {
      return;
    }

    loadingSpinner.style.display = 'block'; 
    errorMessage.style.display = 'none'; 

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var currentTab = tabs[0];
      var url = currentTab.url;

      fetch('https://c3dc-2405-201-e005-5890-4d85-4c06-3833-3d59.ngrok-free.app/v2/generate_summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: url, mood: moodText })
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          loadingSpinner.style.display = 'none';
          summaryResult.innerHTML = `
            <p><strong>Summary:</strong> ${data.summary}</p>
            <p><strong>Images:</strong></p>
            <ul>
              ${data.images.map(image => `<li>${image}</li>`).join('')}
            </ul>
          `;
        })
        .catch(error => {
          console.error('Error:', error);
          loadingSpinner.style.display = 'none'; 
          errorMessage.style.display = 'block'; 
          errorMessage.innerHTML = 'Error fetching data from the API';
        });
    });
  });
});
