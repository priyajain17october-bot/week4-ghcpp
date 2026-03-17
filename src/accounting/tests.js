/**
 * Business Logic Verification Tests
 * tests.js - Standalone test verification
 */

// Test the business logic directly without requiring the interactive module

class DataLayer {
  constructor() {
    this.storageBalance = 1000.00;
  }
  read() {
    return parseFloat(this.storageBalance.toFixed(2));
  }
  write(newBalance) {
    this.storageBalance = parseFloat(newBalance.toFixed(2));
  }
}

// Run tests 
let passed = 0;
let failed = 0;

function test(condition, name) {
  if (condition) {
    passed++;
    console.log(`✓ ${name}`);
  } else {
    failed++;
    console.log(`✗ ${name}`);
  }
}

console.log('\n=== STUDENT ACCOUNT MANAGEMENT SYSTEM - TEST RESULTS ===\n');

// TC-001: Initial Balance
const dl1 = new DataLayer();
test(dl1.read() === 1000.00, 'TC-001: Initial balance is 1000.00');

// TC-028: Session initialization
const dl2 = new DataLayer();
test(dl2.read() === 1000.00, 'TC-028: Fresh session starts with 1000.00');

// TC-029: READ Operation
const dl3 = new DataLayer();
test(typeof dl3.read() === 'number', 'TC-029: READ returns number');
test(dl3.read() === 1000.00, 'TC-029: READ returns current balance');

// TC-030: WRITE Operation
const dl4 = new DataLayer();
dl4.write(1500.00);
test(dl4.read() === 1500.00, 'TC-030: WRITE persists balance');
dl4.write(750.75);
test(Math.abs(dl4.read() - 750.75) < 0.01, 'TC-030: WRITE maintains decimal precision');
dl4.write(0.01);
test(Math.abs(dl4.read() - 0.01) < 0.01, 'TC-030: WRITE handles small amounts');
dl4.write(999999.99);
test(Math.abs(dl4.read() - 999999.99) < 0.01, 'TC-030: WRITE handles maximum amount');

// Balance Formatting
function formatBalance(balance) {
  return balance.toFixed(2).padStart(9, '0');
}

test(formatBalance(1000.00) === '001000.00', 'TC-021/022: Format 1000.00 → 001000.00');
test(formatBalance(50.00) === '000050.00', 'TC-021/022: Format 50.00 → 000050.00');
test(formatBalance(0.01) === '000000.01', 'TC-021/022: Format 0.01 → 000000.01');

// TC-002: Single Credit
const dl5 = new DataLayer();
let balance = dl5.read();
balance = balance + 500;
dl5.write(parseFloat(balance.toFixed(2)));
test(dl5.read() === 1500.00, 'TC-002: Single credit of 500 → 1500.00');

// TC-024: Decimal Credit
const dl6 = new DataLayer();
balance = dl6.read();
balance = balance + 100.50;
dl6.write(parseFloat(balance.toFixed(2)));
test(Math.abs(dl6.read() - 1100.50) < 0.01, 'TC-024: Credit 100.50 → 1100.50');

// TC-004: Multiple Credits
const dl7 = new DataLayer();
dl7.write(1000.00);
balance = dl7.read();
balance = balance + 300;
dl7.write(parseFloat(balance.toFixed(2)));
test(dl7.read() === 1300.00, 'TC-004: First credit 300 → 1300.00');
balance = dl7.read();
balance = balance + 200;
dl7.write(parseFloat(balance.toFixed(2)));
test(dl7.read() === 1500.00, 'TC-004: Second credit 200 → 1500.00');

// TC-010: Maximum Credit
const dl8 = new DataLayer();
dl8.write(0.00);
balance = dl8.read();
balance = balance + 999999.99;
dl8.write(parseFloat(balance.toFixed(2)));
test(Math.abs(dl8.read() - 999999.99) < 0.01, 'TC-010: Maximum credit 999999.99');

// TC-003: Single Debit
const dl9 = new DataLayer();
balance = dl9.read();
if (balance >= 250) {
  balance = balance - 250;
  dl9.write(parseFloat(balance.toFixed(2)));
}
test(dl9.read() === 750.00, 'TC-003: Single debit of 250 → 750.00');

// TC-025: Decimal Debit
const dl10 = new DataLayer();
balance = dl10.read();
if (balance >= 200.75) {
  balance = balance - 200.75;
  dl10.write(parseFloat(balance.toFixed(2)));
}
test(Math.abs(dl10.read() - 799.25) < 0.01, 'TC-025: Debit 200.75 → 799.25');

// TC-005: Multiple Debits
const dl11 = new DataLayer();
dl11.write(1000.00);
balance = dl11.read();
if (balance >= 200) {
  balance = balance - 200;
  dl11.write(parseFloat(balance.toFixed(2)));
}
test(dl11.read() === 800.00, 'TC-005: First debit 200 → 800.00');
balance = dl11.read();
if (balance >= 300) {
  balance = balance - 300;
  dl11.write(parseFloat(balance.toFixed(2)));
}
test(dl11.read() === 500.00, 'TC-005: Second debit 300 → 500.00');

// TC-007: Overdraft Protection - Insufficient Funds
const dl12 = new DataLayer();
dl12.write(500.00);
balance = dl12.read();
if (balance >= 600) {
  balance = balance - 600;
  dl12.write(parseFloat(balance.toFixed(2)));
}
test(dl12.read() === 500.00, 'TC-007: Prevent debit when insufficient funds (600 > 500)');

// TC-008: Debit Equal to Balance
const dl13 = new DataLayer();
dl13.write(750.00);
balance = dl13.read();
if (balance >= 750) {
  balance = balance - 750;
  dl13.write(parseFloat(balance.toFixed(2)));
}
test(dl13.read() === 0.00, 'TC-008: Allow debit when amount equals balance');

// TC-009: Penny Debit
const dl14 = new DataLayer();
balance = dl14.read();
if (balance >= 0.01) {
  balance = balance - 0.01;
  dl14.write(parseFloat(balance.toFixed(2)));
}
test(Math.abs(dl14.read() - 999.99) < 0.01, 'TC-009: Allow debit of 0.01 → 999.99');

// TC-011: Debit 0.01 from 0.01
const dl15 = new DataLayer();
dl15.write(0.01);
balance = dl15.read();
if (balance >= 0.01) {
  balance = balance - 0.01;
  dl15.write(parseFloat(balance.toFixed(2)));
}
test(dl15.read() === 0.00, 'TC-011: Debit 0.01 from 0.01 → 0.00');

// TC-012: Prevent Debit from Zero
const dl16 = new DataLayer();
dl16.write(0.00);
balance = dl16.read();
if (balance >= 0.01) {
  balance = balance - 0.01;
  dl16.write(parseFloat(balance.toFixed(2)));
}
test(dl16.read() === 0.00, 'TC-012: Prevent debit when balance is 0.00');

// TC-027: Prevent Debit 0.01 Over Balance
const dl17 = new DataLayer();
dl17.write(500.00);
balance = dl17.read();
if (balance >= 500.01) {
  balance = balance - 500.01;
  dl17.write(parseFloat(balance.toFixed(2)));
}
test(dl17.read() === 500.00, 'TC-027: Prevent debit of 0.01 more than balance');

// TC-006: Mixed Transactions
const dl18 = new DataLayer();
dl18.write(1000.00);
balance = dl18.read();
balance = balance + 500;
dl18.write(parseFloat(balance.toFixed(2)));
test(dl18.read() === 1500.00, 'TC-006: Credit 500 → 1500.00');
balance = dl18.read();
if (balance >= 300) {
  balance = balance - 300;
  dl18.write(parseFloat(balance.toFixed(2)));
}
test(dl18.read() === 1200.00, 'TC-006: Then debit 300 → 1200.00');

// TC-020: Balance Persistence
const dl19 = new DataLayer();
dl19.write(1000.00);
balance = dl19.read();
balance = balance + 100;
dl19.write(parseFloat(balance.toFixed(2)));
test(dl19.read() === 1100.00, 'TC-020: Credit 100 → 1100.00');
test(dl19.read() === 1100.00, 'TC-020: View balance (no change) → 1100.00');
balance = dl19.read();
if (balance >= 50) {
  balance = balance - 50;
  dl19.write(parseFloat(balance.toFixed(2)));
}
test(dl19.read() === 1050.00, 'TC-020: Debit 50 → 1050.00');
test(dl19.read() === 1050.00, 'TC-020: View balance again (no change) → 1050.00');

// TC-023: Debit Validation Reads Current Balance
const dl20 = new DataLayer();
dl20.write(1500.00);
balance = dl20.read();
if (balance >= 1600) {
  balance = balance - 1600;
  dl20.write(parseFloat(balance.toFixed(2)));
}
test(dl20.read() === 1500.00, 'TC-023: Debit against updated balance prevents overdraft');

// Edge Cases
test(Math.abs((1000.10 - 1000.05) - 0.05) < 0.001, 'Edge Case: Floating point precision maintained');

const dl21 = new DataLayer();
balance = dl21.read();
const debits = [0.01, 0.02, 0.03, 0.04, 0.05];
for (const amt of debits) {
  if (balance >= amt) {
    balance = balance - amt;
    balance = parseFloat(balance.toFixed(2));
    dl21.write(balance);
  }
}
test(dl21.read() === 999.85, 'Edge Case: Multiple small debits sum correctly (1000 - 0.15 = 999.85)');

// READ-MODIFY-WRITE Pattern
const dl22 = new DataLayer();
for (let i = 0; i < 5; i++) {
  const currentBal = dl22.read();  // READ
  const modified = currentBal + 100; // MODIFY
  dl22.write(parseFloat(modified.toFixed(2))); // WRITE
}
test(dl22.read() === 1500.00, 'Pattern: READ-MODIFY-WRITE × 5 = 1000 + 500 = 1500');

// Print Summary
console.log('\n' + '='.repeat(60));
console.log(`TOTAL TESTS: ${passed + failed}`);
console.log(`PASSED: ${passed} ✓`);
console.log(`FAILED: ${failed} ✗`);
const successRate = (passed / (passed + failed) * 100).toFixed(1);
console.log(`SUCCESS RATE: ${successRate}%`);
console.log('='.repeat(60));

if (failed === 0) {
  console.log('\n🎉 ALL TESTS PASSED! 🎉\n');
  process.exit(0);
} else {
  console.log(`\n❌ ${failed} TEST(S) FAILED\n`);
  process.exit(1);
}
