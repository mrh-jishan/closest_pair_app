// ==============================================================================
// 3. JAVASCRIPT FRONTEND LOGIC
// ==============================================================================
document.addEventListener('DOMContentLoaded', () => {
    const runButton = document.getElementById('run_button');
    const nInput = document.getElementById('n_input');
    const allNInput = document.getElementById('all_n_input');
    const loadingDiv = document.getElementById('loading');
    const resultsArea = document.getElementById('results_area');
    const nDisplayViz = document.getElementById('n_display_viz');

    let pointsChart, graph1, graph2, graph3;

    // --- Chart helper functions ---
    function createOrUpdateChart(ctx, chartInstance, config) {
        if (chartInstance) {
            chartInstance.destroy();
        }
        return new Chart(ctx, config);
    }

    function createTable(containerId, headers, data) {
        const container = document.getElementById(containerId);
        let table = '<table class="w-full text-sm text-left text-gray-500">';
        table += '<thead class="text-xs text-gray-700 uppercase bg-gray-50">';
        table += '<tr>';
        headers.forEach(h => table += `<th scope="col" class="px-4 py-3">${h}</th>`);
        table += '</tr></thead>';
        table += '<tbody>';
        data.forEach(row => {
            table += '<tr class="bg-white border-b">';
            row.forEach(cell => table += `<td class="px-4 py-3">${cell}</td>`);
            table += '</tr>';
        });
        table += '</tbody></table>';
        container.innerHTML = table;
    }

    // --- Main function to run experiment ---
    runButton.addEventListener('click', async () => {
        const n = parseInt(nInput.value, 10);
        if (isNaN(n) || n < 2) {
            alert("Please enter a valid number of points (n >= 2).");
            return;
        }

        // Parse the comma-separated list of n-values for the graphs
        const allNString = allNInput.value;
        const allN = allNString.split(',')
            .map(s => parseInt(s.trim(), 10))
            .filter(num => !isNaN(num) && num > 1);

        if (allN.length === 0) {
            alert("Please enter at least one valid n-value for the graphs.");
            return;
        }

        loadingDiv.classList.remove('hidden');
        resultsArea.classList.add('hidden');

        try {
            const response = await fetch('/run-experiment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ n: n, all_n: allN }) // Send a fixed set of n for full graph
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // --- Display results ---
            nDisplayViz.textContent = n;

            // Visualize Points
            const ctxPoints = document.getElementById('pointsChart').getContext('2d');
            const pointsData = data.points.map(p => ({ x: p[0], y: p[1] }));
            const closestPairData = [
                { x: data.results[n].closest_pair_alg1[0][0], y: data.results[n].closest_pair_alg1[0][1] },
                { x: data.results[n].closest_pair_alg1[1][0], y: data.results[n].closest_pair_alg1[1][1] }
            ];
            const pointsChartConfig = {
                type: 'scatter',
                data: {
                    datasets: [{
                        label: `n=${n} Random Points`,
                        data: pointsData,
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        pointRadius: 3
                    }, {
                        label: 'Closest Pair',
                        data: closestPairData,
                        backgroundColor: 'rgba(255, 99, 132, 1)',
                        pointRadius: 6,
                        pointStyle: 'triangle'
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            };
            pointsChart = createOrUpdateChart(ctxPoints, pointsChart, pointsChartConfig);

            // Populate Tables
            const table1Headers = ['n', 'TheoreticalRT', 'EmpiricalRT (ms)', 'Ratio', 'PredictedRT (ms)'];
            const table2Headers = ['n', 'TheoreticalRT', 'EmpiricalRT (ms)', 'Ratio', 'PredictedRT (ms)'];

            const table1Data = Object.values(data.results).map(r => [
                r.n, r.theoretical_rt_alg1.toExponential(2), r.empirical_rt_alg1.toFixed(4),
                r.ratio_alg1.toExponential(2), r.predicted_rt_alg1.toFixed(4)
            ]);
            const table2Data = Object.values(data.results).map(r => [
                r.n, r.theoretical_rt_alg2.toExponential(2), r.empirical_rt_alg2.toFixed(4),
                r.ratio_alg2.toExponential(2), r.predicted_rt_alg2.toFixed(4)
            ]);

            createTable('table1_container', table1Headers, table1Data);
            createTable('table2_container', table2Headers, table2Data);

            // --- Generate Analysis Graphs ---
            const labels = Object.keys(data.results);
            const empirical_alg1 = Object.values(data.results).map(r => r.empirical_rt_alg1);
            const predicted_alg1 = Object.values(data.results).map(r => r.predicted_rt_alg1);
            const empirical_alg2 = Object.values(data.results).map(r => r.empirical_rt_alg2);
            const predicted_alg2 = Object.values(data.results).map(r => r.predicted_rt_alg2);

            // Graph 1: Empirical RT Comparison
            const ctx1 = document.getElementById('graph1').getContext('2d');
            const graph1Config = {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        { label: 'ALG1 Empirical RT', data: empirical_alg1, borderColor: 'rgb(255, 99, 132)', backgroundColor: 'rgba(255, 99, 132, 0.5)', fill: false, tension: 0.1 },
                        { label: 'ALG2 Empirical RT', data: empirical_alg2, borderColor: 'rgb(54, 162, 235)', backgroundColor: 'rgba(54, 162, 235, 0.5)', fill: false, tension: 0.1 }
                    ]
                },
                options: { title: { display: true, text: 'Empirical Running Time Comparison' }, responsive: true, maintainAspectRatio: false }
            };
            graph1 = createOrUpdateChart(ctx1, graph1, graph1Config);

            // Graph 2: ALG1 Empirical vs Predicted
            const ctx2 = document.getElementById('graph2').getContext('2d');
            const graph2Config = {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        { label: 'ALG1 Empirical RT', data: empirical_alg1, borderColor: 'rgb(255, 99, 132)', backgroundColor: 'rgba(255, 99, 132, 0.5)', fill: false, tension: 0.1 },
                        { label: 'ALG1 Predicted RT', data: predicted_alg1, borderColor: 'rgb(255, 159, 64)', backgroundColor: 'rgba(255, 159, 64, 0.5)', fill: false, tension: 0.1, borderDash: [5, 5] }
                    ]
                },
                options: { title: { display: true, text: 'ALG1: Empirical vs. Predicted' }, responsive: true, maintainAspectRatio: false }
            };
            graph2 = createOrUpdateChart(ctx2, graph2, graph2Config);

            // Graph 3: ALG2 Empirical vs Predicted
            const ctx3 = document.getElementById('graph3').getContext('2d');
            const graph3Config = {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        { label: 'ALG2 Empirical RT', data: empirical_alg2, borderColor: 'rgb(54, 162, 235)', backgroundColor: 'rgba(54, 162, 235, 0.5)', fill: false, tension: 0.1 },
                        { label: 'ALG2 Predicted RT', data: predicted_alg2, borderColor: 'rgb(75, 192, 192)', backgroundColor: 'rgba(75, 192, 192, 0.5)', fill: false, tension: 0.1, borderDash: [5, 5] }
                    ]
                },
                options: { title: { display: true, text: 'ALG2: Empirical vs. Predicted' }, responsive: true, maintainAspectRatio: false }
            };
            graph3 = createOrUpdateChart(ctx3, graph3, graph3Config);


        } catch (error) {
            console.error('Error fetching or processing data:', error);
            alert('An error occurred. Please check the console for details.');
        } finally {
            loadingDiv.classList.add('hidden');
            resultsArea.classList.remove('hidden');
        }
    });
});
