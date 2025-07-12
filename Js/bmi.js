// Modern BMI Calculator JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const calculateBtn = document.getElementById('calculate-bmi');
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const bmiValueDisplay = document.getElementById('bmi-value');
    const bmiCategoryDisplay = document.getElementById('bmi-category');
    const bmiPointer = document.getElementById('bmi-pointer');
    const healthAdvice = document.getElementById('health-advice');
    const adviceText = document.getElementById('advice-text');
    const genderInputs = document.querySelectorAll('input[name="gender"]');

    let selectedGender = null;

    // Gender selection handling
    genderInputs.forEach(input => {
        input.addEventListener('change', function() {
            selectedGender = this.value;
        });
    });

    // BMI Calculation Function
    function calculateBMI(weight, height) {
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        return Math.round(bmi * 10) / 10;
    }

    // Get BMI Category and Color
    function getBMICategory(bmi) {
        if (bmi < 18.5) {
            return { 
                category: 'Underweight', 
                color: '#ffc107', 
                advice: 'You may need to gain weight. Consult with a healthcare professional for a personalized nutrition plan.' 
            };
        } else if (bmi >= 18.5 && bmi <= 24.9) {
            return { 
                category: 'Normal Weight', 
                color: '#28a745', 
                advice: 'Excellent! You have a healthy weight. Maintain your current lifestyle with balanced diet and regular exercise.' 
            };
        } else if (bmi >= 25 && bmi <= 29.9) {
            return { 
                category: 'Overweight', 
                color: '#fd7e14', 
                advice: 'Consider adopting a healthier diet and increasing physical activity. Small changes can make a big difference.' 
            };
        } else {
            return { 
                category: 'Obese', 
                color: '#dc3545', 
                advice: 'It\'s important to consult with a healthcare professional for personalized guidance on weight management.' 
            };
        }
    }

    // Animate BMI Gauge Pointer
    function animateBMIPointer(bmi) {
        const maxBMI = 40;
        const minBMI = 15;
        
        // Clamp BMI between min and max values
        const clampedBMI = Math.max(minBMI, Math.min(bmi, maxBMI));
        
        // Calculate rotation angle (-90 to 90 degrees)
        const normalizedBMI = (clampedBMI - minBMI) / (maxBMI - minBMI);
        const rotation = (normalizedBMI * 180) - 90;
        
        if (bmiPointer) {
            bmiPointer.style.transform = `rotate(${rotation}deg)`;
        }
    }

    // Display BMI Result
    function displayBMIResult(bmi, categoryData) {
        // Update BMI value with animation
        bmiValueDisplay.style.opacity = '0';
        setTimeout(() => {
            bmiValueDisplay.textContent = bmi;
            bmiValueDisplay.style.color = categoryData.color;
            bmiValueDisplay.style.opacity = '1';
        }, 200);

        // Update category with animation
        setTimeout(() => {
            bmiCategoryDisplay.style.opacity = '0';
            setTimeout(() => {
                bmiCategoryDisplay.textContent = categoryData.category;
                bmiCategoryDisplay.style.color = categoryData.color;
                bmiCategoryDisplay.style.opacity = '1';
            }, 200);
        }, 300);

        // Animate gauge pointer
        setTimeout(() => {
            animateBMIPointer(bmi);
        }, 400);

        // Show health advice
        setTimeout(() => {
            adviceText.textContent = categoryData.advice;
            healthAdvice.style.display = 'block';
            healthAdvice.style.opacity = '0';
            setTimeout(() => {
                healthAdvice.style.opacity = '1';
            }, 100);
        }, 800);

        // Show success notification
        showNotification(`Your BMI is ${bmi} (${categoryData.category})`, 'success');
    }

    // Input validation
    function validateInputs() {
        const weight = parseFloat(weightInput.value);
        const height = parseFloat(heightInput.value);

        if (!weight || !height) {
            showNotification('Please enter both weight and height', 'error');
            return false;
        }

        if (weight <= 0 || weight > 500) {
            showNotification('Please enter a valid weight (1-500 kg)', 'error');
            return false;
        }

        if (height <= 0 || height > 300) {
            showNotification('Please enter a valid height (1-300 cm)', 'error');
            return false;
        }

        return { weight, height };
    }

    // Show notification
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            ${message}
            <button class="notification-close">&times;</button>
        `;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // Calculate BMI Event Handler
    calculateBtn.addEventListener('click', function() {
        const validationResult = validateInputs();
        
        if (!validationResult) {
            return;
        }

        // Show loading state
        this.classList.add('loading');
        this.disabled = true;

        // Simulate calculation delay for better UX
        setTimeout(() => {
            const { weight, height } = validationResult;
            const bmi = calculateBMI(weight, height);
            const categoryData = getBMICategory(bmi);
            
            displayBMIResult(bmi, categoryData);
            
            // Remove loading state
            this.classList.remove('loading');
            this.disabled = false;
        }, 1000);
    });

    // Enter key support
    [weightInput, heightInput].forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateBtn.click();
            }
        });
    });

    // Real-time input formatting
    [weightInput, heightInput].forEach(input => {
        input.addEventListener('input', function() {
            // Remove any non-numeric characters except decimal point
            this.value = this.value.replace(/[^0-9.]/g, '');
            
            // Ensure only one decimal point
            const parts = this.value.split('.');
            if (parts.length > 2) {
                this.value = parts[0] + '.' + parts.slice(1).join('');
            }
        });
    });

    // Add smooth transitions for form elements
    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach(control => {
        control.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
        });
        
        control.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });

    // Initialize gauge pointer position
    if (bmiPointer) {
        bmiPointer.style.transform = 'rotate(-90deg)';
    }

    // Smooth scroll to result when calculated
    function scrollToResult() {
        const resultContainer = document.querySelector('.bmi-result-container');
        if (resultContainer) {
            resultContainer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    }

    // Add scroll to result after calculation
    const originalDisplayResult = displayBMIResult;
    displayBMIResult = function(bmi, categoryData) {
        originalDisplayResult(bmi, categoryData);
        setTimeout(scrollToResult, 500);
    };
});
