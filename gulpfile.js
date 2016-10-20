var gulp = require("gulp");
var path = require("path");
var runSequence = require("run-sequence")
var builder = require("tsconfig-extended-typescript-builder");
var visualRegressionTestRunner = require("visual-regression-test-runner");
var webdriverStandaloneServer = require("webdriver-standalone-server");

var webDriver = new webdriverStandaloneServer.WebDriver(path.join(__dirname, "./WebDriver.config.js"));
var tsConfigPath = __dirname + "/src/Common/tsconfig";

gulp.task("build", () => {
    if (!builder.build(tsConfigPath)) {
        throw "build failed";
    }
});

gulp.task("clean", () => {
    builder.clean(tsConfigPath)
});

gulp.task("run", () => {
    return webDriver
        .autoStartServer(webdriverStandaloneServer.WebDriverType.Selenium, false)
        .then(() => visualRegressionTestRunner.TestRunner.run({
            config: path.join(__dirname, "./config.js")
        }), visualRegressionTestRunner.Helpers.logError)
        .then(() => process.exit(0), (ex) => process.exit(1));
});

gulp.task('build-run', () => {
    return runSequence("build", "run");
});

gulp.task("start-selenium-server", () => {
    return webDriver.autoStartServer(webdriverStandaloneServer.WebDriverType.Selenium);
});