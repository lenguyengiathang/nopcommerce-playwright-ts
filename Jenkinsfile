pipeline {
    agent any

    environment {
        PATH = "/Users/thangle/.nvm/versions/node/v24.15.0/bin:${env.PATH}"
        CI = 'true'
        BASE_URL = 'http://localhost:9090'
        PLAYWRIGHT_JUNIT_OUTPUT_FILE = 'junit-results.xml'
    }

    options {
        disableConcurrentBuilds()
        timeout(time: 60, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {
        stage('Check environment') {
            steps {
                sh '''
                    node --version
                    npm --version
                    git --version
                '''
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Install Chromium') {
            steps {
                sh 'npx playwright install chromium'
            }
        }

        stage('Run tests') {
            steps {
                withCredentials([
                    file(
                        credentialsId: 'nopcommerce-env',
                        variable: 'TEST_ENV_FILE'
                    )
                ]) {
                    sh '''
                        set +x
                        cp "$TEST_ENV_FILE" .env
                        trap 'rm -f .env' EXIT
                        npx playwright test --project=chromium --reporter=html,junit
                    '''
                }
            }
            post {
                always {
                    junit(
                        testResults: 'junit-results.xml',
                        allowEmptyResults: true
                    )
                    archiveArtifacts(
                        artifacts: 'playwright-report/**',
                        allowEmptyArchive: true
                    )
                }
            }
        }
    }
}