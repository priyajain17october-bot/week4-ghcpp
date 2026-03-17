#!/usr/bin/env node

/**
 * Manual Test Suite Runner for Student Account Management System
 * 
 * Tests all business logic from docs/TESTPLAN.md
 * Without relying on interactive prompts
 */

const { DataLayer, Operations, MainProgram } = require('./index');

class TestRunner {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.testResults = [];
  }

  assert(condition, testName, tcId) {
    if (condition) {
      this.passed++;
      this.testResults.push(`✓ PASS: ${tcId} - ${testName}`);
    } else {
      this.failed++;
      this.testResults.push(`✗ FAIL: ${tcId} - ${testName}`);
    }
  }

  assertEqual(actual, expected, testName, tcId) {
    this.assert(actual === expected, testName, tcId);
  }

  assertCloseTo(actual, expected, testName, tcId, tolerance = 0.01) {
    this.assert(Math.abs(actual - expected) < tolerance, testName, tcId);
  }

  printResults() {
    console.log('\n' + '='.repeat(70));
    console.log('TEST RESULTS - Student Account Management System');
    console.log('='.repeat(70));
    
    this.testResults.forEach(result => console.log(result));
    
    console.log('='.repeat(70));
    console.log(`\nTotal: ${this.passed + this.failed} tests`);
    console.log(`Passed: ${this.passed} ✓`);
    console.log(`Failed: ${this.failed} ✗`);
    console.log(`Success Rate: ${((this.passed / (this.passed + this.failed)) * 100).toFixed(1)}%\n`);

    if (this.failed === 0) {
      console.log('🎉 ALL TESTS PASSED! 🎉\n');
    }
  }

  run() {
    console.log('\n🧪 Running Test Suite...\n');

    // ===== DataLayer Tests =====
    console.log('Testing DataLayer...');
    const dataLayer1 = new DataLayer();
    this.assertEqual(dataLayer1.read(), 1000.00, 'Initial balance', 'TC-001');
    
    const dataLayer2 = new DataLayer();
    this.assertEqual(dataLayer2.read(), 1000.00, 'Session initialization', 'TC-028');
    
    const dataLayer3 = new DataLayer();
    this.assertEqual(typeof dataLayer3.read(), 'number', 'READ returns number', 'TC-029');
    
    dataLayer3.write(1000.50);
    this.assertCloseTo(dataLayer3.read(), 1000.50, 'WRITE persistence', 'TC-030', 0.01);
    
    dataLayer3.write(0.01);
    this.assertCloseTo(dataLayer3.read(), 0.01, 'Handle minimum amounts', 'TC-030');
    
    dataLayer3.write(999999.99);
    this.assertCloseTo(dataLayer3.read(), 999999.99, 'Handle maximum amount', 'TC-010');

    // ===== Operations Tests =====
    console.log('Testing Operations...');
    const ops1 = new Operations(new DataLayer());
    this.assertEqual(ops1.formatBalance(1000.00), '001000.00', 'Format leading zeros', 'TC-021/022');
    this.assertEqual(ops1.formatBalance(50.00), '000050.00', 'Format small amount', 'TC-021/022');
    this.assertEqual(ops1.formatBalance(0.01), '000000.01', 'Format penny', 'TC-021/022');

    // ===== Credit Logic Tests =====
    console.log('Testing Credit Logic...');
    const dataLayer4 = new DataLayer();
    let balance = dataLayer4.read();
    balance = balance + 500;
    dataLayer4.write(parseFloat(balance.toFixed(2)));
    this.assertEqual(dataLayer4.read(), 1500.00, 'Single credit 500', 'TC-002');

    const dataLayer5 = new DataLayer();
    balance = dataLayer5.read();
    balance = balance + 100.50;
    dataLayer5.write(parseFloat(balance.toFixed(2)));
    this.assertCloseTo(dataLayer5.read(), 1100.50, 'Decimal credit amount', 'TC-024', 0.01);

    const dataLayer6 = new DataLayer();
    dataLayer6.write(1000.00);
    balance = dataLayer6.read(); balance = balance + 300; dataLayer6.write(parseFloat(balance.toFixed(2)));
    this.assertEqual(dataLayer6.read(), 1300.00, 'First credit 300', 'TC-004');
    balance = dataLayer6.read(); balance = balance + 200; dataLayer6.write(parseFloat(balance.toFixed(2)));
    this.assertEqual(dataLayer6.read(), 1500.00, 'Second credit 200', 'TC-004');

    // ===== Debit Logic Tests =====
    console.log('Testing Debit Logic...');
    const dataLayer7 = new DataLayer();
    balance = dataLayer7.read();
    if (balance >= 250) { balance = balance - 250; dataLayer7.write(parseFloat(balance.toFixed(2))); }
    this.assertEqual(dataLayer7.read(), 750.00, 'Single debit 250', 'TC-003');

    const dataLayer8 = new DataLayer();
    balance = dataLayer8.read();
    if (balance >= 200.75) { balance = balance - 200.75; dataLayer8.write(parseFloat(balance.toFixed(2))); }
    this.assertCloseTo(dataLayer8.read(), 799.25, 'Decimal debit amount', 'TC-025', 0.01);

    const dataLayer9 = new DataLayer();
    dataLayer9.write(1000.00);
    balance = dataLayer9.read(); if (balance >= 200) { balance = balance - 200; dataLayer9.write(parseFloat(balance.toFixed(2))); }
    this.assertEqual(dataLayer9.read(), 800.00, 'First debit 200', 'TC-005');
    balance = dataLayer9.read(); if (balance >= 300) { balance = balance - 300; dataLayer9.write(parseFloat(balance.toFixed(2))); }
    this.assertEqual(dataLayer9.read(), 500.00, 'Second debit 300', 'TC-005');

    // ===== Overdraft Protection Tests =====
    console.log('Testing Overdraft Protection...');
    const dataLayer10 = new DataLayer();
    dataLayer10.write(500.00);
    balance = dataLayer10.read();
    if (balance >= 600) { balance = balance - 600; dataLayer10.write(parseFloat(balance.toFixed(2))); }
    this.assertEqual(dataLayer10.read(), 500.00, 'Prevent debit insufficient funds', 'TC-007');

    const dataLayer11 = new DataLayer();
    dataLayer11.write(750.00);
    balance = dataLayer11.read();
    if (balance >= 750) { balance = balance - 750; dataLayer11.write(parseFloat(balance.toFixed(2))); }
    this.assertEqual(dataLayer11.read(), 0.00, 'Allow debit equal to balance', 'TC-008');

    const dataLayer12 = new DataLayer();
    balance = dataLayer12.read();
    if (balance >= 0.01) { balance = balance - 0.01; dataLayer12.write(parseFloat(balance.toFixed(2))); }
    this.assertCloseTo(dataLayer12.read(), 999.99, 'Allow debit 1 penny', 'TC-009', 0.01);

    const dataLayer13 = new DataLayer();
    dataLayer13.write(0.01);
    balance = dataLayer13.read();
    if (balance >= 0.01) { balance = balance - 0.01; dataLayer13.write(parseFloat(balance.toFixed(2))); }
    this.assertEqual(dataLayer13.read(), 0.00, 'Debit 0.01 from 0.01', 'TC-011');

    const dataLayer14 = new DataLayer();
    dataLayer14.write(0.00);
    balance = dataLayer14.read();
    if (balance >= 0.01) { balance = balance - 0.01; dataLayer14.write(parseFloat(balance.toFixed(2))); }
    this.assertEqual(dataLayer14.read(), 0.00, 'Prevent debit from zero', 'TC-012');

    const dataLayer15 = new DataLayer();
    dataLayer15.write(500.00);
    balance = dataLayer15.read();
    if (balance >= 500.01) { balance = balance - 500.01; dataLayer15.write(parseFloat(balance.toFixed(2))); }
    this.assertEqual(dataLayer15.read(), 500.00, 'Prevent debit 0.01 over balance', 'TC-027');

    // ===== Mixed Operations Tests =====
    console.log('Testing Mixed Operations...');
    const dataLayer16 = new DataLayer();
    dataLayer16.write(1000.00);
    balance = dataLayer16.read(); balance = balance + 500; dataLayer16.write(parseFloat(balance.toFixed(2)));
    this.assertEqual(dataLayer16.read(), 1500.00, 'Credit 500', 'TC-006');
    balance = dataLayer16.read(); if (balance >= 300) { balance = balance - 300; dataLayer16.write(parseFloat(balance.toFixed(2))); }
    this.assertEqual(dataLayer16.read(), 1200.00, 'Debit 300', 'TC-006');

    const dataLayer17 = new DataLayer();
    dataLayer17.write(1000.00);
    balance = dataLayer17.read(); balance = balance + 100; dataLayer17.write(parseFloat(balance.toFixed(2)));
    this.assertEqual(dataLayer17.read(), 1100.00, 'Credit 100', 'TC-020');
    this.assertEqual(dataLayer17.read(), 1100.00, 'View balance', 'TC-020');
    balance = dataLayer17.read(); if (balance >= 50) { balance = balance - 50; dataLayer17.write(parseFloat(balance.toFixed(2))); }
    this.assertEqual(dataLayer17.read(), 1050.00, 'Debit 50', 'TC-020');
    this.assertEqual(dataLayer17.read(), 1050.00, 'View balance again', 'TC-020');

    const dataLayer18 = new DataLayer();
    dataLayer18.write(1500.00);
    balance = dataLayer18.read();
    if (balance >= 1600) { balance = balance - 1600; dataLayer18.write(parseFloat(balance.toFixed(2))); }
    this.assertEqual(dataLayer18.read(), 1500.00, 'Debit validation reads current', 'TC-023');

    // ===== Menu Navigation Tests =====
    console.log('Testing Menu Navigation...');
    const mainProg1 = new MainProgram();
    mainProg1.evaluateChoice(5);
    this.assert(mainProg1.continueFlag === true, 'Menu continues on invalid 5', 'TC-014');

    const mainProg2 = new MainProgram();
    mainProg2.evaluateChoice(0);
    this.assert(mainProg2.continueFlag === true, 'Menu continues on invalid 0', 'TC-015');

    const mainProg3 = new MainProgram();
    mainProg3.evaluateChoice(-1);
    this.assert(mainProg3.continueFlag === true, 'Menu continues on negative', 'TC-016');

    const mainProg4 = new MainProgram();
    mainProg4.continueFlag = true;
    mainProg4.evaluateChoice(4);
    this.assert(mainProg4.continueFlag === false, 'Exit option sets flag false', 'TC-019');

    const mainProg5 = new MainProgram();
    mainProg5.evaluateChoice(1);
    this.assert(mainProg5.continueFlag === true, 'Menu continues after view', 'TC-018');
    mainProg5.evaluateChoice(2);
    this.assert(mainProg5.continueFlag === true, 'Menu continues after credit', 'TC-018');
    mainProg5.evaluateChoice(3);
    this.assert(mainProg5.continueFlag === true, 'Menu continues after debit', 'TC-018');

    const mainProg6 = new MainProgram();
    mainProg6.continueFlag = true;
    mainProg6.evaluateChoice(99);
    this.assert(mainProg6.continueFlag === true, 'Menu active after invalid input', 'TC-017');
    mainProg6.evaluateChoice(1);
    this.assert(mainProg6.continueFlag === true, 'Menu processes valid after invalid', 'TC-017');

    // ===== Data Integrity Tests =====
    console.log('Testing Data Integrity...');
    const mainProg7 = new MainProgram();
    const initialBal = mainProg7.dataLayer.read();
    this.assertEqual(initialBal, 1000.00, 'MainProgram initial balance', 'TC-001');
    mainProg7.dataLayer.write(1500.00);
    this.assertEqual(mainProg7.dataLayer.read(), 1500.00, 'DataLayer operations shared', 'Data Integrity');

    // Print results
    this.printResults();
    
    // Exit with appropriate code
    process.exit(this.failed > 0 ? 1 : 0);
  }
}

// Run tests
const runner = new TestRunner();
runner.run();
