#!/bin/bash

# Test Runner Script for Student Account Management System
# Executes all test suites and reports results

set -e

cd /workspaces/week4-ghcpp/src/accounting

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  STUDENT ACCOUNT MANAGEMENT SYSTEM - TEST SUITE               ║"
echo "║  Node.js Implementation Test Runner                           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Test 1: Standalone Business Logic Tests
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 1: Running Standalone Business Logic Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if node tests.js; then
  echo ""
  echo "✅ Standalone Tests PASSED"
else
  echo ""
  echo "❌ Standalone Tests FAILED"
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 2: Checking Application Compilation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if node -e "const app = require('./index.js'); console.log('✅ Application module loads successfully')"; then
  echo ""
  echo "✅ Module Compilation PASSED"
else
  echo ""
  echo "❌ Module Compilation FAILED"
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 3: Verifying Dependencies"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if npm list prompt-sync > /dev/null 2>&1; then
  echo "✅ prompt-sync installed"
else
  echo "❌ prompt-sync NOT found"
  exit 1
fi

if npm list jest > /dev/null 2>&1; then
  echo "✅ jest installed"
else
  echo "❌ jest NOT found"
  exit 1
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  ✅ ALL TEST SUITES PASSED SUCCESSFULLY!                        ║"
echo "║                                                                ║"
echo "║  Next Steps:                                                   ║"
echo "║  1. Run 'npm start' to test the interactive application       ║"
echo "║  2. Run 'npm test' for jest unit tests                        ║"
echo "║  3. Review docs/TESTPLAN.md for complete test coverage        ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

exit 0
