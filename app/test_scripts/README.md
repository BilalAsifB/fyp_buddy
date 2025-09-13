# FYP BUDDY Backend Test Scripts

Comprehensive test suite for the FYP BUDDY LangGraph Agent system. These scripts validate all core functionality including database connections, agent graphs, and error handling.

## 🚀 Quick Start

### Run All Tests (Recommended)
```bash
cd app/test_scripts/
python run_all_tests.py
```
**Duration:** 15-25 minutes | **Output:** Console + JSON report

### Run Individual Tests
```bash
python test_config.py          # < 1 second
python test_mongodb.py         # < 5 seconds  
python test_project_agent.py   # 5-10 minutes
python test_interest_agent.py  # 5-10 minutes
python test_match_agent.py     # 2-5 minutes
python test_error_handling.py  # < 30 seconds
python test_backend.py         # 2-5 minutes (Azure backend)
```

## 📋 Test Overview

| Test | Purpose | Duration | Prerequisites |
|------|---------|----------|---------------|
| **Configuration** | Validates environment variables and API keys | < 1s | `.env` file |
| **MongoDB** | Tests database connection and data availability | < 5s | MongoDB running |
| **Project Agent** | Tests project generation with LLM | 5-10m | API keys |
| **Interest Agent** | Tests interest profile generation | 5-10m | API keys |
| **Match Agent** | Tests partner matching algorithm | 2-5m | Database with data |
| **Error Handling** | Tests graceful error recovery | < 30s | None |
| **Backend** | Tests deployed Azure backend | 2-5m | None |

## ⚙️ Prerequisites

**Required Environment Variables:**
```bash
GROQ_API_KEY=your_groq_api_key
LANGSMITH_API_KEY=your_langsmith_api_key  
MONGODB_URI=your_mongodb_connection_string
MONGODB_DATABASE_NAME=fyp_buddy
```

**Database Setup:**
- MongoDB running locally or Atlas connection
- For match testing: Run project/interest generation first to populate data

**Dependencies:**
```bash
cd app/
pip install -r requirements.txt
```

## 📊 Understanding Results

### ✅ Success Indicators
- **100% pass rate** = All systems working
- **80-99% pass rate** = Minor issues, mostly functional
- **< 80% pass rate** = Major issues requiring attention

### Common Outcomes
- **Empty database warnings** = Normal if you haven't generated profiles yet
- **API rate limiting delays** = Expected behavior, tests handle this automatically
- **GPA/gender validation warnings** = Non-critical data quality notices

## 🐛 Troubleshooting

### Configuration Errors
```bash
Missing required settings: ['GROQ_API_KEY']
```
**Fix:** Check your `.env` file contains all required API keys

### Database Connection Failed
```bash
pymongo.errors.ServerSelectionTimeoutError
```
**Fix:** Verify MongoDB is running and connection string is correct

### Import Errors
```bash
ModuleNotFoundError: No module named 'agent'
```
**Fix:** Run from `app/test_scripts/` directory, scripts auto-adjust Python path

### No Matches Found
```bash
No matches found - database is empty
```
**Fix:** Run `python test_project_agent.py` first to populate the database

### Rate Limiting
```bash
groq.RateLimitError: Rate limit exceeded
```
**Fix:** Tests include delays, but you may need to wait between runs

## 📁 Output Files

The tests generate several output files:

**Log Files** (detailed debugging):
- `test_config.log`
- `test_mongodb.log`
- `test_project_agent.log`
- `test_interest_agent.log`
- `test_match_agent.log`
- `test_error_handling.log`
- `run_all_tests.log`

**Test Report** (comprehensive results):
- `test_report_YYYYMMDD_HHMMSS.json`

## 🎯 Test Details

### Configuration Test
Verifies all required environment variables are present and valid.

### MongoDB Test
Tests database connectivity and checks for existing data. Warns if `std_profiles` collection is empty.

### Project Agent Test
Generates 100 unique project profiles using LLM. Validates structure, uniqueness, and metadata constraints.

### Interest Agent Test  
Generates 100 unique interest profiles. Tests variety and proper data structure.

### Match Agent Test
Uses a sample query to find compatible partners. Tests scoring algorithm and result ranking.

### Error Handling Test
Tests system behavior with invalid inputs, connection failures, and edge cases.

### Backend Test
Tests the deployed Azure backend API endpoints and Redis functionality.

## 🔧 Customization

### Modify Test Parameters
Edit individual test files to customize:
```python
# Change number of generated profiles
PROFILES_TO_GENERATE = 50  # Default: 100

# Modify test query
query_profile = Fyp_data(
    title="Your Custom Test Project",
    # ... customize as needed
)
```

### Add Custom Validations
```python
# Add your validation logic in any test
if your_custom_condition:
    logger.info("✓ Custom validation passed")
    passed_tests += 1
```

### Debug Mode
For more detailed output:
```python
logger.add(sys.stdout, level="DEBUG")  # Change INFO to DEBUG
```

## 💡 Best Practices

1. **Start with `run_all_tests.py`** - Gives complete system health overview
2. **Check logs for warnings** - Non-critical issues that might need attention  
3. **Run individual tests for debugging** - Focus on specific failing components
4. **Populate database first** - Run project/interest generation before match testing
5. **Monitor API usage** - Tests make multiple LLM calls, be aware of rate limits

## 📈 Expected Performance

**Healthy System Indicators:**
- All tests pass (100% success rate)
- Project/Interest agents generate 100 unique profiles each
- Match agent finds and ranks results appropriately
- No critical errors in logs
- Total runtime: 15-25 minutes

**System Issues:**
- Configuration errors (missing API keys)
- Database connection failures  
- LLM chain compilation errors
- Multiple test failures (>20%)

---

**Need Help?** Check individual log files for detailed error information or review the troubleshooting section above.
