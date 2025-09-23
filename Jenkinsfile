pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                echo 'Installing npm dependencies...'
                sh 'npm install'

                echo 'Creating zip artefact...'
                sh 'npm run build'
            }
            post {
                success {
                    archiveArtifacts artifacts: 'web-server.zip', fingerprint: true
                }
            }
        }
        stage('Test') {
            steps {
                echo 'Run unit and integration tests.'
            }
        }
        stage('Code Analysis') {
            steps {
                echo 'Analyse code quality.'
            }
        }
        stage('Security Scan') {
            steps {
                echo 'Scan for vulnerabilites.'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploy app to staging.'
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
