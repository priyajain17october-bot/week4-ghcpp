# Student Account Management System - Test Plan

This test plan covers all business logic and functionality of the COBOL Student Account Management System. It is designed to validate core features and edge cases for stakeholder sign-off and will be used to create unit and integration tests in the Node.js migration.

---

## Test Plan Summary

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|---|---|---|---|---|---|---|---|
| TC-001 | View Initial Balance | Application started, no prior transactions | 1. Select option 1 (View Balance) from menu | Display current balance of 1000.00 | | | Initial balance per business rules |
| TC-002 | Successful Single Credit Transaction | Balance = 1000.00 | 1. Select option 2 (Credit Account) 2. Enter amount 500.00 3. View balance | New balance should be 1500.00 | | | Balance formula: 1000.00 + 500.00 = 1500.00 |
| TC-003 | Successful Single Debit Transaction | Balance = 1000.00 | 1. Select option 3 (Debit Account) 2. Enter amount 250.00 3. View balance | New balance should be 750.00 | | | Balance formula: 1000.00 - 250.00 = 750.00 |
| TC-004 | Multiple Consecutive Credit Transactions | Balance = 1000.00 | 1. Credit 300.00 (balance = 1300.00) 2. Credit 200.00 3. View balance | Final balance should be 1500.00 | | | Tests cumulative operations |
| TC-005 | Multiple Consecutive Debit Transactions | Balance = 1000.00 | 1. Debit 200.00 (balance = 800.00) 2. Debit 300.00 3. View balance | Final balance should be 500.00 | | | Tests cumulative debit operations |
| TC-006 | Mixed Credit and Debit Transactions | Balance = 1000.00 | 1. Credit 500.00 (balance = 1500.00) 2. Debit 300.00 3. View balance | Final balance should be 1200.00 | | | Tests mixed transaction types |
| TC-007 | Debit Attempt with Insufficient Funds | Balance = 500.00 | 1. Select option 3 (Debit Account) 2. Enter amount 600.00 | Error message: "Insufficient funds for this debit." Balance remains 500.00 | | | Overdraft protection active |
| TC-008 | Debit Amount Equal to Current Balance | Balance = 750.00 | 1. Select option 3 (Debit Account) 2. Enter amount 750.00 3. View balance | New balance should be 0.00 | | | Equal or greater condition boundary test |
| TC-009 | Debit of 0.01 from Balance of 1000.00 | Balance = 1000.00 | 1. Debit 0.01 2. View balance | New balance should be 999.99 | | | Tests minimum debit amount (penny) |
| TC-010 | Credit of Maximum Amount | Balance = 0.00 | 1. Select option 2 (Credit Account) 2. Enter amount 999999.99 | New balance should be 999999.99 | | | Tests upper limit of 9(6)V99 data type |
| TC-011 | Debit of 1 Penny with Balance of 0.01 | Balance = 0.01 | 1. Select option 3 (Debit Account) 2. Enter amount 0.01 3. View balance | New balance should be 0.00 | | | Boundary test for minimum balance |
| TC-012 | Debit When Balance is 0.00 | Balance = 0.00 | 1. Select option 3 (Debit Account) 2. Enter amount 0.01 | Error message: "Insufficient funds for this debit." Balance remains 0.00 | | | Zero balance protection test |
| TC-013 | Invalid Menu Selection - Letter Input | Application at main menu | 1. Enter 'A' at menu prompt | Error message: "Invalid choice, please select 1-4." Menu redisplayed | | | Invalid input handling |
| TC-014 | Invalid Menu Selection - Out of Range Number | Application at main menu | 1. Enter 5 at menu prompt | Error message: "Invalid choice, please select 1-4." Menu redisplayed | | | Boundary test for menu range (5 > max) |
| TC-015 | Invalid Menu Selection - Out of Range Number (Below Min) | Application at main menu | 1. Enter 0 at menu prompt | Error message: "Invalid choice, please select 1-4." Menu redisplayed | | | Boundary test for menu range (0 < min) |
| TC-016 | Invalid Menu Selection - Negative Number | Application at main menu | 1. Enter -1 at menu prompt | Error message: "Invalid choice, please select 1-4." Menu redisplayed | | | Tests negative number rejection |
| TC-017 | Menu Continues After Invalid Selection | Application at main menu after invalid input | 1. Enter invalid value 2. Receive error 3. Verify menu redisplayed | Menu should redisplay and accept new input | | | Tests menu loop continuity |
| TC-018 | Menu Loop Continues After Valid Operation | Application after completing operation 1 | 1. Complete any operation (view/credit/debit) 2. Verify menu redisplayed | Menu should redisplay and accept new selection | | | Tests menu loop functionality |
| TC-019 | Exit Program Option | Application at main menu | 1. Select option 4 (Exit) | Display "Exiting the program. Goodbye!" and terminate | | | Graceful program termination |
| TC-020 | Balance Persistence Across Operations | Initial balance 1000.00 | 1. Credit 100.00 (1100.00) 2. View balance 3. Debit 50.00 (1050.00) 4. View balance | Each view reflects accurate cumulative result (1100.00 then 1050.00) | | | Tests state management during session |
| TC-021 | Balance Display Format - Decimal Places | Balance after any operation | 1. Perform any transaction 2. View balance | Balance displays with exactly 2 decimal places (e.g., 1000.00, 250.50) | | | Tests currency formatting requirement |
| TC-022 | Balance Display Format - Leading Zeros | New balance = 50.00 | 1. Set balance to 50.00 2. View balance | Balance displays as 000050.00 with leading zeros | | | Tests COBOL numeric display format |
| TC-023 | Debit Validation - Reads Current Balance | Balance = 1000.00 after prior credit | 1. Credit 500.00 (balance = 1500.00) 2. Attempt debit of 1600.00 | Error message: "Insufficient funds for this debit." Confirms validation uses updated balance | | | Tests that debit reads current balance |
| TC-024 | Credit with Decimal Amount | Balance = 1000.00 | 1. Select option 2 (Credit Account) 2. Enter amount 100.50 | New balance should be 1100.50 | | | Tests decimal precision for cents |
| TC-025 | Debit with Decimal Amount | Balance = 1000.00 | 1. Select option 3 (Debit Account) 2. Enter amount 200.75 | New balance should be 799.25 | | | Tests decimal precision for cents |
| TC-026 | View Balance Does Not Modify Account | Balance = 1000.00 | 1. Select option 1 (View Balance) 3 times | Balance remains 1000.00 after each view | | | View operation has no side effects |
| TC-027 | Debit Prevented at Exact Insufficient Amount | Balance = 500.00 | 1. Attempt debit of 500.01 | Error: "Insufficient funds for this debit." Balance remains 500.00 | | | Precise insufficient funds check |
| TC-028 | Session Initialization - Starting Balance | Fresh application start | 1. Select option 1 (View Balance) immediately | Balance should display as 1000.00 | | | Validates initial balance assignment |
| TC-029 | Data Program - Read Operation | Balance = 750.00 set by operations | 1. Select View Balance to trigger DataProgram READ | Current balance correctly retrieved and displayed as 750.00 | | | Tests inter-program data communication |
| TC-030 | Data Program - Write Operation | Initial balance 1000.00 | 1. Credit 250.00 to trigger DataProgram WRITE 2. View balance without closing app 3. Credit another 100.00 | Balance updates persist: 1250.00 then 1350.00 | | | Tests data persistence across calls |

---

## Test Execution Notes

### Scope
This test plan covers:
- **Functional Testing:** All menu options and operations
- **Boundary Testing:** Decimal limits, balance extremes, menu ranges
- **Integration Testing:** Data flow between Main, Operations, and Data programs
- **State Management:** Balance persistence and accuracy
- **Error Handling:** Invalid inputs and overdraft protection
- **Formatting:** Currency display with proper decimal and leading zero formatting

### Out of Scope
- Database persistence (app currently uses in-memory storage)
- Multi-user concurrent access
- Performance testing
- Security testing
- Network communication

### Platform
- **Compiler:** GnuCOBOL (cobc)
- **Operating System:** Linux
- **Execution:** ./accountsystem

### Test Data
- Initial Balance: $1,000.00
- Data Type: 9(6)V99 (maximum $999,999.99)
- Decimal Precision: 2 places (cents)

### Prerequisites for Execution
1. COBOL compiler installed and in PATH
2. Application compiled successfully
3. Executable permissions set on accountsystem binary
4. Clean application state (no prior sessions interfering)

### Pass/Fail Criteria
- **PASS:** Operation produces expected result and displays correctly
- **FAIL:** Operation deviates from expected result or throws unexpected error
- **N/A:** Test not applicable to current environment

---

## Migration to Node.js Testing

This test plan will be used to create:
1. **Unit Tests:** Individual function testing for each operation (view, credit, debit)
2. **Integration Tests:** Inter-module communication and data flow
3. **E2E Tests:** Complete user workflows through the application
4. **Validation Tests:** Input validation and error handling

Each test case ID (TC-XXX) corresponds to a specific test scenario that should have equivalent coverage in the Node.js implementation.

