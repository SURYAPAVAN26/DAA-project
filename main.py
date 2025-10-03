from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    # This route serves your main HTML page.
    return render_template('index.html')

@app.route('/sort', methods=['POST'])
def sort():
    # This is the API endpoint that JavaScript will call.
    data = request.get_json()
    
    # --- Input Validation ---
    if not data or 'array' not in data:
        return jsonify({'error': 'Missing array in request'}), 400
    arr = data['array']
    if not isinstance(arr, list) or not all(isinstance(x, (int, float)) for x in arr):
        return jsonify({'error': 'Array must be a list of numbers'}), 400
    
    # --- Sorting ---
    steps = bubble_sort(arr)
    return jsonify({'steps': steps})

def bubble_sort(arr):
    # This function performs the bubble sort and records each step.
    steps = []
    n = len(arr)
    arr_copy = arr.copy() # Work on a copy to not alter the original list passed
    
    for i in range(n - 1):
        swapped_in_pass = False
        for j in range(0, n - i - 1):
            compared_indices = [j, j + 1]
            swapped_indices = []

            if arr_copy[j] > arr_copy[j + 1]:
                # Perform the swap
                arr_copy[j], arr_copy[j + 1] = arr_copy[j + 1], arr_copy[j]
                swapped_indices = [j, j + 1]
                swapped_in_pass = True

            # Record the state of the array after the potential swap
            step_info = {
                'array': arr_copy.copy(),
                'compared': compared_indices,
                'swapped': swapped_indices,
                'sorted': list(range(n - i, n)) # Mark elements at the end as sorted
            }
            steps.append(step_info)
        
        # Optimization: If no swaps occurred in a pass, the array is sorted
        if not swapped_in_pass:
            break

    # Add a final step to show the fully sorted array
    steps.append({
        'array': arr_copy.copy(),
        'compared': [],
        'swapped': [],
        'sorted': list(range(n))
    })
    return steps

if __name__ == '__main__':
    # This line starts the development server
    app.run(debug=True)