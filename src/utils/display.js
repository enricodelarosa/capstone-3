export function displayAmt(amt) {
    return Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        }).format(amt)
}


