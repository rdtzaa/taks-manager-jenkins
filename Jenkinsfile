pipeline {
    agent any

    tools {
        nodejs 'NodeJS-18'   // harus sama dengan nama yang kamu set di Tools
    }

    environment {
        APP_NAME = 'task-manager'
        NODE_ENV = 'test'
    }

    triggers {
        githubPush()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Test') {
            steps {
                sh 'npm run test:ci'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                // SONAR_HOST_URL & SONAR_TOKEN otomatis dari Jenkins config
                withSonarQubeEnv('SonarQube') {
                    sh 'npx sonar-scanner'
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build') {
            parallel {
                stage('Lint Check') {
                    steps {
                        sh 'node --check src/app.js'
                    }
                }
                stage('Dependency Audit') {
                    steps {
                        sh 'npm audit --audit-level=high || true'
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline: ${currentBuild.result ?: 'SUCCESS'}"
            cleanWs()
        }
        success {
            echo "✅ Build #${env.BUILD_NUMBER} succeeded"
        }
        failure {
            echo "❌ Build #${env.BUILD_NUMBER} failed"
        }
    }
}