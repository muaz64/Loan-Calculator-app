document.getElementById('calculateBtn').addEventListener('click', calculateLoan);

function calculateLoan() {
    const loanAmount = parseFloat(document.getElementById("loanAmountInput").value);
    const interestRate = parseFloat(document.getElementById("interestRateInput").value);
    const loanTerm = parseFloat(document.getElementById("loanTermInput").value);

    if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTerm)) {
        alert("Please enter valid numbers for all fields");
        return;
    }

    const monthlyInterest = interestRate / 100 / 12;
    const totalPayments = loanTerm;
    const monthlyPayment = (loanAmount * monthlyInterest) / (1 - Math.pow(1 + monthlyInterest, -totalPayments));
    const totalInterest = (monthlyPayment * totalPayments) - loanAmount;

    displayResult(monthlyPayment, totalInterest);
    generateAmortizationSchedule(loanAmount, monthlyInterest, monthlyPayment, totalPayments);
}

function displayResult(monthlyPayment, totalInterest) {
    const resultDiv = document.getElementById('result');

    resultDiv.innerHTML = `
        <p><strong>Monthly Payment:</strong> ${monthlyPayment.toFixed(2)}</p>
        <p><strong>Total Interest:</strong> ${totalInterest.toFixed(2)}</p>
    `;
}

function generateAmortizationSchedule(loanAmount, monthlyInterest, monthlyPayment, totalPayments) {
    const scheduleBody = document.getElementById('scheduleBody');
    scheduleBody.innerHTML = ''; // Clear any existing rows

    let balance = loanAmount;
    
    for (let i = 1; i <= totalPayments; i++) {
        const interestPayment = balance * monthlyInterest;
        const principalPayment = monthlyPayment - interestPayment;
        balance -= principalPayment;

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
}
