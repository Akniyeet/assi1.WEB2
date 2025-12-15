// Import express library
const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Global HTML template with CSS
const HTML_TEMPLATE = (title, content) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        /* Reset and base styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            padding: 40px;
            width: 100%;
            max-width: 500px;
            text-align: center;
            animation: fadeIn 0.5s ease-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        h1, h2 {
            color: #333;
            margin-bottom: 30px;
            font-weight: 600;
        }
        
        h1 {
            color: #4a5568;
            font-size: 2.5rem;
        }
        
        h2 {
            font-size: 1.8rem;
        }
        
        /* Form styles */
        .form-group {
            margin-bottom: 25px;
            text-align: left;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            color: #4a5568;
            font-weight: 500;
            font-size: 1.1rem;
        }
        
        input[type="number"] {
            width: 100%;
            padding: 15px;
            border: 2px solid #e2e8f0;
            border-radius: 10px;
            font-size: 1rem;
            transition: border-color 0.3s, box-shadow 0.3s;
        }
        
        input[type="number"]:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        input[type="number"]::placeholder {
            color: #a0aec0;
        }
        
        /* Button styles */
        .btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 16px 40px;
            border-radius: 10px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.3s, box-shadow 0.3s;
            display: inline-block;
            text-decoration: none;
            margin: 10px;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }
        
        .btn:active {
            transform: translateY(0);
        }
        
        /* Result styles */
        .result-box {
            padding: 30px;
            border-radius: 15px;
            margin: 30px 0;
            transition: all 0.3s;
        }
        
        .bmi-value {
            font-size: 4rem;
            font-weight: 700;
            margin: 20px 0;
        }
        
        .bmi-category {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 20px;
        }
        
        .category-underweight {
            background: linear-gradient(135deg, #63b3ed 0%, #4299e1 100%);
            color: white;
        }
        
        .category-normal {
            background: linear-gradient(135deg, #68d391 0%, #48bb78 100%);
            color: white;
        }
        
        .category-overweight {
            background: linear-gradient(135deg, #f6ad55 0%, #ed8936 100%);
            color: white;
        }
        
        .category-obese {
            background: linear-gradient(135deg, #fc8181 0%, #f56565 100%);
            color: white;
        }
        
        /* BMI scale info */
        .bmi-scale {
            background: #f7fafc;
            border-radius: 10px;
            padding: 20px;
            margin: 30px 0;
            text-align: left;
        }
        
        .bmi-scale h3 {
            color: #4a5568;
            margin-bottom: 15px;
            font-size: 1.2rem;
        }
        
        .scale-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .scale-item:last-child {
            border-bottom: none;
        }
        
        .error-message {
            background: #fed7d7;
            color: #c53030;
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
            border-left: 4px solid #f56565;
        }
        
        /* Footer */
        .footer {
            margin-top: 30px;
            color: #718096;
            font-size: 0.9rem;
        }
        
        /* Mobile responsiveness */
        @media (max-width: 600px) {
            .container {
                padding: 25px;
            }
            
            h1 {
                font-size: 2rem;
            }
            
            h2 {
                font-size: 1.5rem;
            }
            
            .bmi-value {
                font-size: 3rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        ${content}
    </div>
    <script>
        // Form validation
        function validateForm() {
            const weight = document.getElementById('weight');
            const height = document.getElementById('height');
            
            if (!weight || !height) return true;
            
            if (weight.value <= 0 || height.value <= 0) {
                alert('Please enter positive numbers for weight and height.');
                return false;
            }
            
            if (height.value < 0.5 || height.value > 2.5) {
                alert('Please enter a realistic height between 0.5m and 2.5m.');
                return false;
            }
            
            if (weight.value > 300) {
                alert('Please enter a realistic weight under 300kg.');
                return false;
            }
            
            return true;
        }
        
        // Auto-focus on first input
        document.addEventListener('DOMContentLoaded', function() {
            const firstInput = document.querySelector('input[type="number"]');
            if (firstInput) {
                firstInput.focus();
            }
        });
    </script>
</body>
</html>
`;

// Home page with form
app.get('/', (req, res) => {
    const content = `
        <h1>📊 BMI Calculator</h1>
        <form action="/calculate-bmi" method="POST" onsubmit="return validateForm()">
            <div class="form-group">
                <label for="weight">Weight (kg):</label>
                <input type="number" id="weight" name="weight" required 
                       min="0" step="0.1" placeholder="e.g., 70.5">
            </div>
            
            <div class="form-group">
                <label for="height">Height (m):</label>
                <input type="number" id="height" name="height" required 
                       min="0.5" max="2.5" step="0.01" placeholder="e.g., 1.75">
            </div>
            
            <button type="submit" class="btn">Calculate BMI</button>
        </form>
        
        <div class="bmi-scale">
            <h3>📈 BMI Categories:</h3>
            <div class="scale-item">
                <span>Underweight</span>
                <span>&lt; 18.5</span>
            </div>
            <div class="scale-item">
                <span>Normal weight</span>
                <span>18.5 – 24.9</span>
            </div>
            <div class="scale-item">
                <span>Overweight</span>
                <span>25 – 29.9</span>
            </div>
            <div class="scale-item">
                <span>Obesity</span>
                <span>≥ 30</span>
            </div>
        </div>
        
        <div class="footer">
            BMI = weight (kg) / [height (m)]²
        </div>
    `;
    
    res.send(HTML_TEMPLATE('BMI Calculator', content));
});

// Handle BMI calculation
app.post('/calculate-bmi', (req, res) => {
    const { weight, height } = req.body;
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    
    // Validation
    if (!weight || !height || isNaN(weightNum) || isNaN(heightNum) || 
        weightNum <= 0 || heightNum <= 0 || heightNum < 0.5 || heightNum > 2.5) {
        
        const errorContent = `
            <div class="error-message">
                <h2>⚠️ Invalid Input</h2>
                <p>Please enter valid positive numbers:</p>
                <p>• Weight: 0.1 to 300 kg</p>
                <p>• Height: 0.5 to 2.5 meters</p>
            </div>
            <a href="/" class="btn">Try Again</a>
        `;
        
        return res.send(HTML_TEMPLATE('Error - BMI Calculator', errorContent));
    }
    
    // Calculate BMI
    const bmi = weightNum / (heightNum * heightNum);
    const roundedBmi = Math.round(bmi * 10) / 10;
    
    // Determine category
    let category = '';
    let categoryClass = '';
    
    if (bmi < 18.5) {
        category = 'Underweight';
        categoryClass = 'category-underweight';
    } else if (bmi < 25) {
        category = 'Normal Weight';
        categoryClass = 'category-normal';
    } else if (bmi < 30) {
        category = 'Overweight';
        categoryClass = 'category-overweight';
    } else {
        category = 'Obese';
        categoryClass = 'category-obese';
    }
    
    // Health recommendations
    let recommendation = '';
    if (category === 'Underweight') {
        recommendation = 'Consider consulting a nutritionist to develop a healthy weight gain plan.';
    } else if (category === 'Normal Weight') {
        recommendation = 'Great! Maintain your current healthy lifestyle with balanced diet and regular exercise.';
    } else if (category === 'Overweight') {
        recommendation = 'Consider increasing physical activity and adjusting your diet. Small changes can make a big difference!';
    } else {
        recommendation = 'We recommend consulting with a healthcare provider for guidance on weight management.';
    }
    
    const content = `
        <h1>📊 Your BMI Result</h1>
        
        <div class="result-box ${categoryClass}">
            <div class="bmi-value">${roundedBmi}</div>
            <div class="bmi-category">${category}</div>
        </div>
        
        <div style="margin: 25px 0; font-size: 1.1rem; color: #4a5568;">
            <p><strong>Weight:</strong> ${weightNum} kg</p>
            <p><strong>Height:</strong> ${heightNum} m</p>
            <p><strong>Formula:</strong> ${weightNum} ÷ (${heightNum} × ${heightNum}) = ${roundedBmi}</p>
        </div>
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; margin: 25px 0; text-align: left;">
            <h3 style="color: #2c5282; margin-bottom: 10px;">💡 Recommendation:</h3>
            <p>${recommendation}</p>
        </div>
        
        <div style="margin: 30px 0;">
            <a href="/" class="btn">Calculate Another BMI</a>
        </div>
        
        <div class="footer">
            Note: BMI is a screening tool, not a diagnostic measure. Consult a healthcare professional for personalized advice.
        </div>
    `;
    
    res.send(HTML_TEMPLATE('BMI Result', content));
});

// Start server
app.listen(port, () => {
    console.log(` Server running at: http://localhost:${port}`);
    console.log(` Open this link in your browser: http://localhost:${port}`);
    console.log(` Press Ctrl+C to stop the server`);
});
