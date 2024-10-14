// document.getElementById('search-form').addEventListener('submit', function (event) {
//     event.preventDefault();
    
//     let query = document.getElementById('query').value;
//     let resultsDiv = document.getElementById('results');
//     resultsDiv.innerHTML = '';

//     fetch('/search', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: new URLSearchParams({
//             'query': query
//         })
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log(data);
//         displayResults(data);
//         displayChart(data);
//     });
// });
document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();
    
    let query = document.getElementById('query').value;
    let resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',  // Correct content type for JSON data
        },
        body: JSON.stringify({
            'query': query   // Send the query as a JSON object
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        displayResults(data);
        displayChart(data);
    })
    .catch(error => console.error('Error:', error));
});

// function displayResults(data) {
//     let resultsDiv = document.getElementById('results');
//     resultsDiv.innerHTML = '<h2>Results</h2>';
//     for (let i = 0; i < data.documents.length; i++) {
//         let docDiv = document.createElement('div');
//         let documentText = data.documents[i].text;  // Access the actual text property of the document
//         let similarityScore = data.similarities[i];  // Similarity score for the document
        
//         docDiv.innerHTML = `
//             <strong>Document ${data.indices[i]}</strong>
//             <p>${documentText}</p>
//             <br><strong>Similarity: ${similarityScore}</strong>`;
        
//         resultsDiv.appendChild(docDiv);
//     }
// }

function displayResults(data) {
    let resultsDiv = document.getElementById('results');
    
    if (data.documents.length > 0) {
        resultsDiv.innerHTML = '<h2>Results</h2>';
        resultsDiv.style.display = 'block'; // Show results container
        for (let i = 0; i < data.documents.length; i++) {
            let docDiv = document.createElement('div');
            docDiv.innerHTML = `<strong>Document ${data.indices[i]}</strong><p>${data.documents[i].text}</p><br><strong>Similarity: ${data.similarities[i]}</strong>`;
            resultsDiv.appendChild(docDiv);
        }
    } else {
        resultsDiv.innerHTML = ''; // Clear results
        resultsDiv.style.display = 'none'; // Hide results container if no documents
    }
}

let chartInstance = null;

function displayChart(data) {
    // Input: data (object) - contains the following keys:
    //        - documents (list) - list of documents
    //        - indices (list) - list of indices   
    //        - similarities (list) - list of similarities
    // TODO: Implement function to display chart here
    //       There is a canvas element in the HTML file with the id 'similarity-chart'
    // Destroy the old chart if it exists
    if (chartInstance) {
        chartInstance.destroy();
    }

    let labels = data.indices.map((_, i) => `Doc ${data.indices[i]}`);
    let similarities = data.similarities;

    let ctx = document.getElementById('similarity-chart').getContext('2d');
    // create a new chart with the data
    chartInstance = new Chart(ctx, { 
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Cosine Similarity',
                data: similarities,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1 
                }
            }
        }
    });
}

