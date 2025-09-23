pipeline {
    agent any

    environment {
    SONAR_TOKEN = credentials('SONAR_TOKEN')
  }
    
    stages {
        stage('Build') {
            steps {
                echo 'Building Docker image with dependencies...'
                sh 'docker-compose build --no-cache'
            }
            post {
                success {
                    echo 'Saving Docker image as an artefact...'
                    sh 'docker save cozylightbookstore-cozybookstore | gzip > cozybookstore-image.tar.gz'
                    archiveArtifacts artifacts: 'cozybookstore-image.tar.gz', fingerprint: true
                    echo 'Docker image saved and archived.'
                }
            }
        }
        stage('Test') {
            steps {
                echo 'Running unit and integration tests...'
                sh 'docker-compose run --rm cozybookstore npm test'
                junit 'test-results/junit.xml'
            }
        }
        stage('Code Analysis') {
            steps {
                sh '''
                curl -sSLo sonar-scanner.zip https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-7.2.0.5079-linux-x64.zip
                unzip -o sonar-scanner.zip
                export PATH=$PWD/sonar-scanner-7.2.0.5079-linux-x64/bin:$PATH
                sonar-scanner
                '''
            }
        }
        stage('Security Scan') {
            steps {
                echo 'Scan for vulnerabilites.'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying application with Docker Compose...'
                sh 'docker-compose up -d'
                echo 'Application is now running at http://localhost:3000'
            }
        }
        stage('Release') {
            steps {
                echo "Deploy app to production."
            }
        }
        stage('Monitoring and Alerting') {
            steps {
                echo "Deploy app to production."
            }
        }
    }
}
