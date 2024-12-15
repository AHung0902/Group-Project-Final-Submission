


let chartInstance; // Holds the chart instance

// Populate dropdowns with available currencies
function populate_curr() {
    fetch('https://api.frankfurter.app/currencies')
        .then(response => response.json())
        .then(data => {
            for (const [key, value] of Object.entries(data)) {
                const from_choice = document.createElement('option');
                from_choice.value = key;
                from_choice.textContent = value;
                document.getElementById('fromCurrency').appendChild(from_choice);

                const to_choice = document.createElement('option');
                to_choice.value = key;
                to_choice.textContent = value;
                document.getElementById('toCurrency').appendChild(to_choice);
            }
        });
}

// Swap the two selected currencies
function swapCurrencies() {
    const fromDropdown = document.getElementById('fromCurrency');
    const toDropdown = document.getElementById('toCurrency');

    // Swap the selected values
    const tempValue = fromDropdown.value;
    fromDropdown.value = toDropdown.value;
    toDropdown.value = tempValue;
}

// Convert currency and display result
function convert() {
    const from = document.getElementById('fromCurrency').value;
    const to = document.getElementById('toCurrency').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const days = parseInt(document.getElementById('days').value);

    if (from === to) {
        alert("You cannot convert the same values");
        return;
    }
    if (days <= 0 || isNaN(days)) {
        alert("Please enter a valid number of days greater than 0.");
        return;
    }

    fetch(`https://api.frankfurter.app/latest?base=${from}&symbols=${to}`)
        .then(resp => resp.json())
        .then(data => {
            const convertedAmount = (amount * data.rates[to]).toFixed(2);
            document.getElementById('word').innerText = `${amount} ${from} = ${convertedAmount} ${to}`;
            fetchTrends(from, to, days); // Fetch and display historical trends
        });
}

// Fetch historical currency conversion rates
function fetchTrends(from, to, days) {
    const endDate = new Date().toISOString().split('T')[0]; // Today's date
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days); // User-defined days ago
    const startDateStr = startDate.toISOString().split('T')[0];

    fetch(`https://api.frankfurter.app/${startDateStr}..${endDate}?from=${from}&to=${to}`)
        .then(response => response.json())
        .then(data => {
            const dates = Object.keys(data.rates);
            const rates = dates.map(date => data.rates[date][to]);

            renderChart(dates, rates, from, to);
        });
}

// Render chart using Chart.js
function renderChart(dates, rates, from, to) {
    const ctx = document.getElementById('currencyChart').getContext('2d');
    
    // Destroy existing chart instance if it exists
    if (chartInstance) {
        chartInstance.destroy();
    }

    // Create a new chart
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: `Exchange Rate: ${from} to ${to}`,
                data: rates,
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `Currency Conversion Trend (${from} to ${to})`
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Exchange Rate'
                    }
                }
            }
        }
    });
}

window.onload = populate_curr;
