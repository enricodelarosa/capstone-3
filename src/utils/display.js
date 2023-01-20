export function displayAmt(amt) {
    return Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        }).format(amt)
}

export function dtDisplay(isoFormat) {
    const date = new Date(isoFormat);
    return date.toLocaleString();
}
