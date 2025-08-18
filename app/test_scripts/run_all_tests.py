#!/usr/bin/env python3
"""
Master Test Runner - Runs all individual tests and provides summary
"""

import sys
import subprocess
import json
from pathlib import Path
from datetime import datetime
from typing import Dict, Any

from loguru import logger

# Configure logger
logger.remove()
logger.add(
    sys.stdout,
    format="<green>{time:HH:mm:ss}</green> | <level>{level: <8}</level> | <level>{message}</level>",
    level="INFO"
)
logger.add("run_all_tests.log", level="DEBUG")


class TestRunner:
    """Runs all individual test scripts and collects results"""
    
    def __init__(self):
        self.test_scripts = [
            ("Configuration Test", "test_config.py"),
            ("MongoDB Connection Test", "test_mongodb.py"),
            ("Project Generation Agent", "test_project_agent.py"),
            ("Interest Generation Agent", "test_interest_agent.py"),
            ("Match Finding Agent", "test_match_agent.py"),
            ("Error Handling Test", "test_error_handling.py")
        ]
        
        self.results = {}
        self.start_time = datetime.now()
    
    def run_test(self, test_name: str, script_name: str) -> bool:
        """Run a single test script and return success status"""
        logger.info(f"🏃 Running {test_name}...")
        
        try:
            # Run the test script
            result = subprocess.run(
                [sys.executable, script_name],
                cwd=Path(__file__).parent,
                capture_output=True,
                text=True,
                timeout=600  # 10 minute timeout
            )
            
            success = result.returncode == 0
            
            # Store results
            self.results[test_name] = {
                "success": success,
                "returncode": result.returncode,
                "stdout": result.stdout,
                "stderr": result.stderr,
                "script": script_name
            }
            
            if success:
                logger.success(f"✅ {test_name} PASSED")
            else:
                logger.error(f"❌ {test_name} FAILED")
                
                # Show error output
                if result.stderr:
                    logger.error("STDERR:")
                    for line in result.stderr.strip().split('\n')[-10:]:  # Last 10 lines
                        logger.error(f"  {line}")
                
                if result.stdout:
                    logger.debug("STDOUT:")
                    for line in result.stdout.strip().split('\n')[-5:]:  # Last 5 lines
                        logger.debug(f"  {line}")
            
            return success
            
        except subprocess.TimeoutExpired:
            logger.error(f"❌ {test_name} TIMED OUT (>10 minutes)")
            self.results[test_name] = {
                "success": False,
                "error": "Test timed out after 10 minutes",
                "script": script_name
            }
            return False
        except Exception as e:
            logger.error(f"❌ {test_name} ERROR: {e}")
            self.results[test_name] = {
                "success": False,
                "error": str(e),
                "script": script_name
            }
            return False
    
    def run_all_tests(self) -> Dict[str, Any]:
        """Run all tests and return comprehensive results"""
        logger.info("🚀 Starting FYP Agent Test Suite")
        logger.info("=" * 60)
        
        passed = 0
        failed = 0
        
        # Run each test
        for test_name, script_name in self.test_scripts:
            success = self.run_test(test_name, script_name)
            
            if success:
                passed += 1
            else:
                failed += 1
            
            # Brief pause between tests
            import time
            time.sleep(1)
            
            logger.info("")  # Empty line for readability
        
        # Calculate summary
        total_tests = len(self.test_scripts)
        success_rate = (passed / total_tests) * 100
        duration = datetime.now() - self.start_time
        
        summary = {
            "timestamp": self.start_time.isoformat(),
            "duration_seconds": duration.total_seconds(),
            "total_tests": total_tests,
            "passed": passed,
            "failed": failed,
            "success_rate": f"{success_rate:.1f}%",
            "results": self.results
        }
        
        # Print summary
        print("\n" + "="*60)
        print("📋 FINAL TEST SUMMARY")
        print("="*60)
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed}")
        print(f"Failed: {failed}")
        print(f"Success Rate: {success_rate:.1f}%")
        print(f"Duration: {duration}")
        print("")
        
        # List results
        for test_name, result in self.results.items():
            status = "✅ PASS" if result["success"] else "❌ FAIL"
            print(f"{status} - {test_name}")
        
        print("="*60)
        
        # Overall verdict
        if failed == 0:
            logger.success("🎉 ALL TESTS PASSED! Your agent is working correctly.")
        elif failed <= 2:
            logger.warning(f"⚠️  Most tests passed with {failed} failure(s). Check the failed tests.")
        else:
            logger.error(f"❌ Multiple test failures ({failed}). Your agent needs attention.")
        
        return summary
    
    def save_report(self, summary: Dict[str, Any]):
        """Save detailed test report"""
        report_file = f"test_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        with open(report_file, 'w') as f:
            json.dump(summary, f, indent=2, default=str)
        
        logger.info(f"📊 Detailed test report saved to {report_file}")
    
    def check_prerequisites(self) -> bool:
        """Check if all test scripts exist"""
        logger.info("🔍 Checking prerequisites...")
        
        missing_scripts = []
        test_dir = Path(__file__).parent
        
        for test_name, script_name in self.test_scripts:
            script_path = test_dir / script_name
            if not script_path.exists():
                missing_scripts.append(script_name)
        
        if missing_scripts:
            logger.error("❌ Missing test scripts:")
            for script in missing_scripts:
                logger.error(f"  • {script}")
            return False
        
        logger.info("✅ All test scripts found")
        return True
    
    def show_individual_logs(self):
        """Show information about individual test logs"""
        logger.info("\n📁 Individual test logs:")
        test_dir = Path(__file__).parent
        
        log_files = [
            "test_config.log",
            "test_mongodb.log", 
            "test_project_agent.log",
            "test_interest_agent.log",
            "test_match_agent.log",
            "test_error_handling.log"
        ]
        
        for log_file in log_files:
            log_path = test_dir / log_file
            if log_path.exists():
                size = log_path.stat().st_size
                logger.info(f"  • {log_file} ({size} bytes)")
            else:
                logger.info(f"  • {log_file} (not found)")


def main():
    """Main execution"""
    runner = TestRunner()
    
    # Check prerequisites
    if not runner.check_prerequisites():
        logger.error("❌ Prerequisites not met. Make sure all test scripts are in the same directory.")
        return sys.exit(1)
    
    try:
        # Run all tests
        summary = runner.run_all_tests()
        
        # Save report
        runner.save_report(summary)
        
        # Show log info
        runner.show_individual_logs()
        
        # Exit with appropriate code
        if summary["failed"] == 0:
            sys.exit(0)
        else:
            sys.exit(1)
    
    except KeyboardInterrupt:
        logger.warning("🛑 Testing interrupted by user")
        sys.exit(1)
    except Exception as e:
        logger.error(f"❌ Fatal error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
