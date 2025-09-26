pipeline {
    agent any

    environment {
    SONAR_TOKEN = credentials('SONAR_TOKEN')
    SNYK_API_TOKEN = credentials('SNYK_TOKEN')
    AWS_DEFAULT_REGION = "ap-southeast-2"
    AWS_CREDENTIALS = credentials('Jenkins-With-Beanstalk-Credentials')
    APP_NAME = "CozylightBookStore"
    ENV_NAME = "CozylightBookStore-prod"
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
                sonar-scanner -Dsonar.login=$SONAR_TOKEN
                '''
            }
        }
        stage('Security Scan') {
            steps {
                sh '''
                echo 'Authenticating..'
                snyk config set api=${SNYK_API_TOKEN}

                echo 'Scanning Node.js dependencies...'
                snyk test || true

                snyk monitor --all-projects || true

                echo 'Scanning Docker image...'
                snyk container test myapp:latest || true
                '''
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
                withAWS(credentials: 'Jenkins-With-Beanstalk-Credentials', region: "${AWS_DEFAULT_REGION}") {
                    sh '''
                    zip -r deploy.zip . -x "*.git*" "node_modules/*" "docker/*" "*.zip" "*.tar.gz" "sonar-scanner*"

                    aws s3 cp deploy.zip s3://elasticbeanstalk-ap-southeast-2-901792596992/app-${BUILD_NUMBER}.zip
                    
                    aws elasticbeanstalk create-application-version \
                        --application-name ${APP_NAME} \
                        --version-label build-${BUILD_NUMBER} \
                        --source-bundle S3Bucket=elasticbeanstalk-ap-southeast-2-901792596992,S3Key=app-${BUILD_NUMBER}.zip

                    aws elasticbeanstalk update-environment \
                        --environment-name ${ENV_NAME} \
                        --version-label build-${BUILD_NUMBER}
                    '''
                }
            }
        }
        stage('Monitoring and Alerting') {
            steps {
                echo 'Checking deployed application health...'
                script {
                    def health = sh(script: "aws elasticbeanstalk describe-environments --environment-names $ENV_NAME --query 'Environments[0].Health' --output text", returnStdout: true).trim()
                    echo 'Environment Health: ${health}'

                    def statusCode = sh(script: "curl -o /dev/null -s -w '%{http_code}\\n' http://cozylightbooks.ap-southeast-2.elasticbeanstalk.com/", returnStdout: true).trim()
                    echo 'Application HTTP Status: ${statusCode}'

                    if (statusCode != '200') {
                        error("Application failed the health check")
                    }
                    echo 'Deployed application is healthy. Ongoing monitoring is being performed through AWS CloudWatch'
                }
            }
        }
    }
}
