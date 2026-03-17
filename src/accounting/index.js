const prompt = require('prompt-sync')();

/**
 * Data Layer - Manages persistent account balance storage
 * Equivalent to: data.cob (DataProgram)
 */
class DataLayer {
  constructor() {
    // Initial balance: $1,000.00
    this.storageBalance = 1000.00;
  }

  /**
   * READ Operation: Retrieves the current account balance
   * @returns {number} Current balance with 2 decimal precision
   */
  read() {
    return parseFloat(this.storageBalance.toFixed(2));
  }

  /**
   * WRITE Operation: Updates the account balance in persistent storage
   * @param {number} newBalance - Balance value to persist
   */
  write(newBalance) {
    this.storageBalance = parseFloat(newBalance.toFixed(2));
  }
}

/**
 * Operations Layer - Implements business logic for account operations
 * Equivalent to: operations.cob (Operations program)
 */
class Operations {
  constructor(dataLayer) {
    this.dataLayer = dataLayer;
  }

  /**
   * TOTAL Operation: Display current account balance
   * Triggers READ operation from data layer
   */
  viewBalance() {
    const currentBalance = this.dataLayer.read();
    const formattedBalance = this.formatBalance(currentBalance);
    console.log(`Current balance: ${formattedBalance}`);
  }

  /**
   * CREDIT Operation: Add funds to account
   * 1. Prompts for credit amount
   * 2. Reads current balance
   * 3. Adds credit amount to balance
   * 4. Writes updated balance to storage
   */
  creditAccount() {
    process.stdout.write('Enter credit amount: ');
    const amountInput = prompt();
    const amount = parseFloat(amountInput);

    // Validate input
    if (isNaN(amount) || amount < 0) {
      console.log('Invalid amount. Please enter a positive number.');
      return;
    }

    // READ current balance
    let finalBalance = this.dataLayer.read();

    // ADD amount to balance
    finalBalance = finalBalance + amount;
    finalBalance = parseFloat(finalBalance.toFixed(2));

    // WRITE updated balance to storage
    this.dataLayer.write(finalBalance);

    const formattedBalance = this.formatBalance(finalBalance);
    console.log(`Amount credited. New balance: ${formattedBalance}`);
  }

  /**
   * DEBIT Operation: Withdraw funds from account
   * 1. Prompts for debit amount
   * 2. Reads current balance
   * 3. Validates balance >= debit amount (overdraft protection)
   * 4. If sufficient: subtracts amount and writes updated balance
   * 5. If insufficient: displays error and prevents transaction
   */
  debitAccount() {
    process.stdout.write('Enter debit amount: ');
    const amountInput = prompt();
    const amount = parseFloat(amountInput);

    // Validate input
    if (isNaN(amount) || amount < 0) {
      console.log('Invalid amount. Please enter a positive number.');
      return;
    }

    // READ current balance
    let finalBalance = this.dataLayer.read();

    // VALIDATE: Check if sufficient funds (overdraft protection)
    if (finalBalance >= amount) {
      // SUBTRACT amount from balance
      finalBalance = finalBalance - amount;
      finalBalance = parseFloat(finalBalance.toFixed(2));

      // WRITE updated balance to storage
      this.dataLayer.write(finalBalance);

      const formattedBalance = this.formatBalance(finalBalance);
      console.log(`Amount debited. New balance: ${formattedBalance}`);
    } else {
      // Insufficient funds - prevent transaction
      console.log('Insufficient funds for this debit.');
    }
  }

  /**
   * Format balance with proper currency display
   * Matches COBOL format: XXXXXX.XX with leading zeros
   * @param {number} balance - Balance to format
   * @returns {string} Formatted balance (e.g., "001000.00")
   */
  formatBalance(balance) {
    return balance.toFixed(2).padStart(9, '0');
  }
}

/**
 * Main Program - User interface and orchestration
 * Equivalent to: main.cob (MainProgram)
 * Displays menu and routes user selections to appropriate operations
 */
class MainProgram {
  constructor() {
    this.dataLayer = new DataLayer();
    this.operations = new Operations(this.dataLayer);
    this.continueFlag = true;
  }

  /**
   * Display interactive menu with four options
   * Routes user selections to appropriate operations
   * Menu loop continues until user selects Exit (option 4)
   */
  run() {
    while (this.continueFlag) {
      this.displayMenu();
      process.stdout.write('Enter your choice (1-4): ');
      const userChoice = parseInt(prompt());

      this.evaluateChoice(userChoice);
    }

    console.log('Exiting the program. Goodbye!');
  }

  /**
   * Display the main menu with all available options
   */
  displayMenu() {
    console.log('--------------------------------');
    console.log('Account Management System');
    console.log('1. View Balance');
    console.log('2. Credit Account');
    console.log('3. Debit Account');
    console.log('4. Exit');
    console.log('--------------------------------');
  }

  /**
   * Route user choice to appropriate operation
   * Validates menu selection is between 1-4
   * @param {number} userChoice - User's menu selection
   */
  evaluateChoice(userChoice) {
    switch (userChoice) {
      case 1:
        // View Balance
        this.operations.viewBalance();
        break;
      case 2:
        // Credit Account
        this.operations.creditAccount();
        break;
      case 3:
        // Debit Account
        this.operations.debitAccount();
        break;
      case 4:
        // Exit
        this.continueFlag = false;
        break;
      default:
        // Invalid choice
        console.log('Invalid choice, please select 1-4.');
    }
  }
}

/**
 * Application Entry Point
 * Initializes main program and starts the interactive menu loop
 */
const mainProgram = new MainProgram();
mainProgram.run();
