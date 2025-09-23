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
                    echo 'Build successful, artefact created'
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
                echo 'Deploying application...'
                sh 'mkdir -p deploy_dir'
                sh 'unzip -o web-server.zip -d deploy_dir'
                sh 'cd deploy_dir && npm install --production'
                sh 'cd deploy_dir && nohup npm start > server.log 2>&1 &'
                echo 'Application deployed and running on localhost:3000'
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
