# Student Account Management System - Node.js Implementation

This is a Node.js port of the original COBOL Student Account Management System, preserving all business logic, data integrity, and menu functionality.

## Project Structure

```
src/accounting/
├── index.js              # Main application entry point
├── package.json          # Project dependencies and scripts
└── node_modules/         # Installed dependencies
```

## Architecture

The application follows a three-layer architecture, mirroring the original COBOL implementation:

### Layer 1: Data Layer (DataLayer class)
- Manages persistent account balance storage
- Implements READ and WRITE operations
- Initial balance: $1,000.00
- Maintains 2 decimal place precision for currency

### Layer 2: Operations Layer (Operations class)
- Implements business logic for account operations
- **viewBalance()** - Display current account balance (TOTAL operation)
- **creditAccount()** - Add funds to account with validation
- **debitAccount()** - Withdraw funds with overdraft protection
- Formats balance output with leading zeros (e.g., "001000.00")

### Layer 3: Main Program (MainProgram class)
- User interface and menu orchestration
- Displays interactive menu with 4 options
- Routes user selections to appropriate operations
- Menu loop continues until exit selected

## Installation

Prerequisites:
- Node.js 12.0 or higher
- npm 6.0 or higher

Install dependencies:
```bash
cd src/accounting
npm install
```

## Running the Application

### Standard Run
```bash
npm start
```

### Development Mode (with inspector)
```bash
npm run dev
```

### Direct Execution
```bash
node index.js
```

## VS Code Integration

Three launch configurations are available in `.vscode/launch.json`:

1. **Run Accounting App** - Standard execution of Node.js app
2. **Debug Accounting App** - Debug mode with breakpoint support
3. **Run COBOL Application** - Execute the original COBOL binary (reference)

**To run via VS Code:**
1. Press `F5` or go to Run → Start Debugging
2. Select the desired configuration from the dropdown
3. Use VS Code's debugger tools to step through code, set breakpoints, etc.

## Business Logic

### Initial Balance
- Every session starts with a balance of $1,000.00
- Balance resets each time the application is restarted (in-memory storage)

### Menu Options

#### 1. View Balance
- Display current account balance formatted with leading zeros and 2 decimal places
- No modifications to account data
- Read operation only

#### 2. Credit Account
- Prompts user for credit amount
- Reads current balance from storage
- Adds credit amount to current balance
- Writes updated balance back to storage
- Displays new balance with proper formatting
- No validation limits (any positive amount accepted)

#### 3. Debit Account
- Prompts user for debit amount
- Reads current balance from storage
- **Validates sufficient funds** (balance >= debit amount)
  - If funds available: subtracts amount, writes updated balance, displays new balance
  - If insufficient: displays error message, prevents transaction, balance unchanged
- **Overdraft protection enabled** - prevents negative balances

#### 4. Exit
- Displays "Exiting the program. Goodbye!"
- Terminates application

### Menu Navigation
- Invalid menu selections (not 1-4) display error message and redisplay menu
- Menu loop continues after every operation until user selects Exit
- Handles edge cases gracefully

### Input Validation
- Amount entries validated as positive numbers
- Invalid numeric input displays error and prompts user again
- Debit operations validate available balance before transaction

## Data Flow

```
User Input
    ↓
Main Program (Menu & Routing)
    ↓
Operations Layer (Business Logic)
    ├─→ Read from Data Layer
    ├─→ Process/Validate
    ├─→ Write to Data Layer
    └─→ Format & Display Result
    ↓
Data Layer (Storage)
    ↓
User Output
```

## Comparison to COBOL Original

| Feature | COBOL | Node.js |
|---------|-------|---------|
| Language | GnuCOBOL | JavaScript (ES6+) |
| Menu Display | DISPLAY statements | console.log() |
| User Input | ACCEPT statements | prompt-sync library |
| Program Calls | CALL statements | Class methods |
| Data Storage | WORKING-STORAGE SECTION | Class properties |
| Balance Format | PIC 9(6)V99 | JavaScript number with toFixed(2) |
| Leading Zeros | Automatic (PIC format) | Manual padding |
| Error Handling | IF/ELSE blocks | if/else statements |
| Decimal Precision | Handled by COBOL | JavaScript toFixed() |

## Business Rules Preserved

1. ✓ Initial balance: $1,000.00
2. ✓ Overdraft protection (no negative balances)
3. ✓ Decimal precision: 2 places (cents)
4. ✓ READ-MODIFY-WRITE pattern for operations
5. ✓ Balance persists across operations in same session
6. ✓ Invalid menu input handling
7. ✓ Formatted balance display with leading zeros
8. ✓ Menu loop until explicit exit

## Testing

See `docs/TESTPLAN.md` for comprehensive test plan with 30 test cases covering:
- Core functionality (view, credit, debit)
- Boundary conditions (minimum/maximum amounts)
- Overdraft protection
- Menu navigation
- Input validation
- State management and persistence
- Display formatting

## Dependencies

- **prompt-sync** (^4.2.0) - Synchronous command-line input for interactive prompts
  - Replaces COBOL's ACCEPT statement functionality
  - Enables menu-driven interactive experience

## Future Enhancements

- Database persistence across sessions
- User authentication and account-specific tracking
- Transaction history logging
- Multiple account support
- Input validation for decimal amounts
- Audit logging for compliance
- Express.js REST API wrapper
- Unit and integration tests with Jest or Mocha

## Migration Notes

This implementation was created as part of a modernization effort to port a legacy COBOL application to Node.js. All original business logic, validation rules, and user interface behavior has been preserved to ensure functional equivalency.

Key implementation decisions:
- Used ES6 classes to structure layers similar to COBOL program modules
- Maintained single-threaded sequential execution model
- Preserved menu-driven interactive interface
- Kept balance formatting identical to COBOL output
- Implemented comprehensive code comments referencing original COBOL equivalents

## License

MIT

