# FYP Agent Test Scripts

This directory contains comprehensive test scripts for the FYP (Final Year Project) LangGraph Agent system.

## 📁 Directory Structure

```
app/test_scripts/
├── test_config.py           # Configuration and environment variables test
├── test_mongodb.py          # MongoDB connection and data test
├── test_project_agent.py    # Project generation agent test
├── test_interest_agent.py   # Interest generation agent test
├── test_match_agent.py      # Match finding agent test
├── test_error_handling.py   # Error handling and edge cases test
├── run_all_tests.py         # Master test runner
└── README.md               # This file
```

## 🚀 Quick Start

### Run All Tests
```bash
cd app/test_scripts/
python run_all_tests.py
```

### Run Individual Tests
```bash
# Test configuration
python test_config.py

# Test MongoDB connection
python test_mongodb.py

# Test project generation agent
python test_project_agent.py

# Test interest generation agent
python test_interest_agent.py

# Test match finding agent
python test_match_agent.py

# Test error handling
python test_error_handling.py
```

## 📋 Test Descriptions

### 1. Configuration Test (`test_config.py`)
- ✅ Verifies all required environment variables are set
- ✅ Checks GROQ_API_KEY, LANGSMITH_API_KEY, MONGODB_URI, etc.
- ⚠️ **Prerequisites**: Valid `.env` file with API keys

### 2. MongoDB Test (`test_mongodb.py`)
- ✅ Tests MongoDB connection
- ✅ Checks `std_profiles` collection availability
- ✅ Validates document retrieval
- ⚠️ **Prerequisites**: MongoDB instance running and accessible

### 3. Project Generation Agent Test (`test_project_agent.py`)
- ✅ Tests project generation graph compilation
- ✅ Validates generated project structure
- ✅ Checks metadata completeness and constraints
- ✅ Verifies project uniqueness and variety
- ⚠️ **Prerequisites**: Valid GROQ and LangSmith API keys
- ⏱️ **Duration**: 5-10 minutes (due to API rate limiting)

### 4. Interest Generation Agent Test (`test_interest_agent.py`)
- ✅ Tests interest generation graph compilation
- ✅ Validates generated interest profiles
- ✅ Checks metadata structure and constraints
- ✅ Verifies profile uniqueness
- ⚠️ **Prerequisites**: Valid GROQ and LangSmith API keys
- ⏱️ **Duration**: 5-10 minutes (due to API rate limiting)

### 5. Match Finding Agent Test (`test_match_agent.py`)
- ✅ Tests match finding graph with sample query
- ✅ Validates match results and scoring
- ✅ Checks result sorting and structure
- ⚠️ **Prerequisites**: Database with existing profiles
- ⏱️ **Duration**: 2-5 minutes

### 6. Error Handling Test (`test_error_handling.py`)
- ✅ Tests invalid input handling
- ✅ Tests database connection errors
- ✅ Tests empty database scenarios
- ✅ Validates graceful error recovery

## 📊 Test Output

### Console Output
- Real-time test progress with colored logging
- Individual test results (✅ PASS / ❌ FAIL)
- Final summary with success rates

### Log Files
Each test creates its own log file:
- `test_config.log`
- `test_mongodb.log`
- `test_project_agent.log`
- `test_interest_agent.log`
- `test_match_agent.log`
- `test_error_handling.log`
- `run_all_tests.log`

### Test Report
- `test_report_YYYYMMDD_HHMMSS.json` - Comprehensive JSON report with all test data

## ⚠️ Prerequisites

Before running tests, ensure you have:

1. **Environment Variables Set**:
   ```bash
   GROQ_API_KEY=your_groq_api_key
   LANGSMITH_API_KEY=your_langsmith_api_key
   MONGODB_URI=your_mongodb_connection_string
   MONGODB_DATABASE_NAME=fyp_buddy
   ```

2. **MongoDB Running**:
   - Local MongoDB instance, or
   - MongoDB Atlas connection

3. **Dependencies Installed**:
   ```bash
   cd app/
   pip install -r requirements.txt  # or however you manage dependencies
   ```

4. **Database with Data** (for match testing):
   - Run project or interest generation first to populate the database
   - Or ensure `std_profiles` collection has sample data

## 🐛 Troubleshooting

### Common Issues

1. **Import Errors**:
   ```
   ModuleNotFoundError: No module named 'agent'
   ```
   - **Solution**: Make sure you're running from `app/test_scripts/` directory
   - The scripts automatically adjust the Python path

2. **API Rate Limiting**:
   ```
   groq.RateLimitError: Rate limit exceeded
   ```
   - **Solution**: Tests include built-in delays, but you may need to wait longer between runs

3. **MongoDB Connection Failed**:
   ```
   pymongo.errors.ServerSelectionTimeoutError
   ```
   - **Solution**: Check MongoDB is running and connection string is correct

4. **Empty Database**:
   ```
   No matches found - database is empty
   ```
   - **Solution**: Run project/interest generation agents first to populate data

5. **Missing API Keys**:
   ```
   Missing required settings: ['GROQ_API_KEY']
   ```
   - **Solution**: Check your `.env` file and environment variables

### Debug Mode
For more detailed output, check the individual log files or modify the logging level in any test script:

```python
logger.add(sys.stdout, level="DEBUG")  # Change INFO to DEBUG
```

## 🎯 Expected Results

### Healthy System
- All 6 tests should pass (100% success rate)
- Project/Interest generation should create 100 unique profiles each
- Match agent should find and rank matches appropriately
- No critical errors in logs

### Acceptable Issues
- Warnings about GPA/gender values outside expected ranges (non-critical)
- Empty database warnings (if you haven't populated data yet)
- Rate limiting delays (expected behavior)

### Critical Issues
- Configuration errors (missing API keys)
- MongoDB connection failures
- Import/module errors
- LLM chain compilation failures

## 📈 Performance Expectations

| Test | Expected Duration | Memory Usage | API Calls |
|------|------------------|--------------|-----------|
| Configuration | < 1 second | Minimal | 0 |
| MongoDB | < 5 seconds | Low | 0 |
| Project Agent | 5-10 minutes | Medium | ~5-10 |
| Interest Agent | 5-10 minutes | Medium | ~5-10 |
| Match Agent | 2-5 minutes | Medium | Variable |
| Error Handling | < 30 seconds | Low | 1-2 |

**Total Expected Duration**: 15-25 minutes for all tests

## 🔧 Customization

You can modify individual tests by:

1. **Changing test parameters**:
   ```python
   # In test_match_agent.py
   query_profile = Fyp_data(
       title="Your Custom Test Project",
       # ... modify as needed
   )
   ```

2. **Adjusting timeouts**:
   ```python
   # In run_all_tests.py
   timeout=1200  # 20 minutes instead of 10
   ```

3. **Adding custom validations**:
   ```python
   # Add your own validation logic in any test
   if custom_condition:
       logger.info("✓ Custom validation passed")
   ```