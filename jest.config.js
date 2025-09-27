module.exports = {
    testEnvironment: 'node',
    verbose: true,
    collectCoverage: true,
    coverageReporters: ["lcov", "text"],
    coverageDirectory: '/app/coverage',
    coveragePathIgnorePatterns: [
        "/public_html",
        "/tests",
        "jest.config.js",
        "createBookDB.js",
        "createEnquiryDB.js"
    ],
    reporters: [
        'default',
        ['jest-junit', {
            outputDirectory: './test-results',
            outputName: 'junit.xml'
        }]
    ]
};