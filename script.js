document.getElementById('calculateBtn').addEventListener('click', calculateLoan);

function calculateLoan() {
    // Get input values
    const loanAmount = parseFloat(document.getElementById("loanAmountInput").value);
    const interestRate = parseFloat(document.getElementById("interestRateInput").value);
    const loanTerm = parseFloat(document.getElementById("loanTermInput").value);
    const prepayment = parseFloat(document.getElementById("prepaymentInput").value) || 0;

    // Validate inputs
    if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTerm)) {
        alert("Please enter valid numbers for all fields");
        return;
    }

    // Calculate loan details
    const monthlyInterest = interestRate / 100 / 12;
    const totalPayments = loanTerm;
    const monthlyPayment = (loanAmount * monthlyInterest) / (1 - Math.pow(1 + monthlyInterest, -totalPayments));
    const totalInterest = (monthlyPayment * totalPayments) - loanAmount;

    // Display results
    displayResult(monthlyPayment, totalInterest);
    generateAmortizationSchedule(loanAmount, monthlyInterest, monthlyPayment, totalPayments, prepayment);
    generatePaymentChart(loanAmount, totalInterest);
}

function displayResult(monthlyPayment, totalInterest) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <p><strong>Monthly Payment:</strong> ${monthlyPayment.toFixed(2)}</p>
        <p><strong>Total Interest:</strong> ${totalInterest.toFixed(2)}</p>
    `;
}

function generateAmortizationSchedule(loanAmount, monthlyInterest, monthlyPayment, totalPayments, prepayment) {
    const scheduleBody = document.getElementById('scheduleBody');
    scheduleBody.innerHTML = ''; // Clear existing rows

    let balance = loanAmount;
    let totalInterestPaid = 0;

    for (let i = 1; i <= totalPayments && balance > 0; i++) {
        const interestPayment = balance * monthlyInterest;
        const principalPayment = monthlyPayment - interestPayment + prepayment;
        balance -= principalPayment;

        if (balance < 0) {
            balance = 0;
        }

        totalInterestPaid += interestPayment;

        const row = `
            <tr>
                <td>${i}</td>
                <td>${interestPayment.toFixed(2)}</td>
                <td>${principalPayment.toFixed(2)}</td>
                <td>${balance.toFixed(2)}</td>
            </tr>
        `;
        scheduleBody.insertAdjacentHTML('beforeend', row);
    }

    displayResult(monthlyPayment, totalInterestPaid);  // Update results with actual interest paid
}

function generatePaymentChart(loanAmount, totalInterest) {
    const ctx = document.getElementById('paymentChart').getContext('2d');

    // Ensure paymentChart exists before trying to destroy it
    if (window.paymentChart instanceof Chart) {
        window.paymentChart.destroy();  // Destroy previous chart if exists
    }

    window.paymentChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Principal', 'Total Interest'],
            datasets: [{
                label: 'Loan Payment Breakdown',
                data: [loanAmount, totalInterest],
                backgroundColor: ['#4caf50', '#f44336'],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return label + ': $' + value.toFixed(2);
                        }
                    }
                }
            }
        }
    });
}
