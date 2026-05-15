@echo off
cd /d "D:\eduquest"
echo "Starting EduQuest Verification Script Test Suite..."
echo.
echo "Test Results Directory: scripts/test-results"
echo "Start Time: %date% %time%"
echo.
echo "=============================================================="
echo "Running tests..."
echo.

REM Run test coverage script
cd /d "D:\eduquest\scripts"
call test-verification-scripts.sh

echo.
echo "=============================================================="
echo "Test Summary"
echo "=============================================================="
echo "Total Tests: %TOTAL_TESTS%"
echo "Passed: %PASSED_TESTS%"
echo "Failed: %FAILED_TESTS%"
echo "Success Rate: %PASSED_TESTS%%TOTAL_TESTS%%* 100 / TOTAL_TESTS%%%"
echo "End Time: %date% %time%"
echo "=============================================================="
echo.
echo "Recommendations"
echo "=============================================================="
if %FAILED_TESTS% gtr 0 (
    echo "⚠️  Some tests failed. Review the following:"
    echo.
    echo "Next steps:"
    echo "1. Review failed test logs in scripts/test-results/"
    echo "2. Check environment configuration"
    echo "3. Verify Supabase CLI is installed and authenticated"
    echo "4. Test scripts manually with appropriate environment"
) else (
    echo "🎉 All tests passed!"
    echo.
    echo "Next steps:"
    echo "1. Review test results in scripts/test-results/"
    echo "2. Run scripts with actual environment for final validation"
    echo "3. Integrate into CI/CD pipeline"
)
echo.
echo "Test files can be found in: scripts/test-results/"
echo.
pause