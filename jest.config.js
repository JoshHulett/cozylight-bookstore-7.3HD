module.exports = {
    testEnvironment: 'node',
    verbose: true,
    reporters: [
        'default',
        ['jest-junit', {
            outputDirectory: './test-results',
            outputName: 'junit.xml'
        }]
    ]
};