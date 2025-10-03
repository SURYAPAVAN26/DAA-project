document.addEventListener('DOMContentLoaded', () => {
    const sortButton = document.getElementById('sort-button');
    const arrayInput = document.getElementById('array-input');
    const visualizerContainer = document.getElementById('visualizer-container');
    const errorMessage = document.getElementById('error-message');

    // Function to introduce a delay
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Function to render the array bars
    const renderArray = (step) => {
        visualizerContainer.innerHTML = ''; // Clear previous bars
        const maxValue = Math.max(...step.array);

        step.array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.classList.add('bar');
            
            // Calculate height as a percentage of the max value
            const barHeight = (value / maxValue) * 95 + 5; // Min height of 5%
            bar.style.height = `${barHeight}%`;
            bar.textContent = value;

            // Apply colors based on the step information
            if (step.sorted.includes(index)) {
                bar.classList.add('bar-sorted');
            } else if (step.swapped.includes(index)) {
                bar.classList.add('bar-swapped');
            } else if (step.compared.includes(index)) {
                bar.classList.add('bar-compared');
            }

            visualizerContainer.appendChild(bar);
        });
    };

    sortButton.addEventListener('click', async () => {
        // 1. Get and validate input
        const inputText = arrayInput.value.trim();
        if (!inputText) {
            errorMessage.textContent = 'Please enter an array.';
            return;
        }

        const numbers = inputText.split(',')
            .map(item => item.trim())
            .filter(item => item !== '')
            .map(Number);
        
        if (numbers.some(isNaN) || numbers.length < 2) {
            errorMessage.textContent = 'Please enter a valid, comma-separated list of at least two numbers.';
            return;
        }

        errorMessage.textContent = '';
        sortButton.disabled = true; // Disable button during animation

        try {
            // 2. Send array to backend
            const response = await fetch('/sort', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ array: numbers }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Something went wrong');
            }

            const data = await response.json();
            const steps = data.steps;

            // 3. Animate the steps received from backend
            for (const step of steps) {
                renderArray(step);
                await sleep(500); // Adjust speed of animation here (in milliseconds)
            }

        } catch (error) {
            errorMessage.textContent = `Error: ${error.message}`;
        } finally {
            sortButton.disabled = false; // Re-enable button
        }
    });

    // Initial render with a sample array
    renderArray({ array: [5, 3, 8, 1, 4], compared: [], swapped: [], sorted: [] });
});