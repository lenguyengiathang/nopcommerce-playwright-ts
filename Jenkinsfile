pipeline {
    agent any

    environment {
        PATH = "/Users/thangle/.nvm/versions/node/v24.15.0/bin:${env.PATH}"
        CI = 'true'
        BASE_URL = 'http://localhost:9090'
        PLAYWRIGHT_JUNIT_OUTPUT_FILE = 'junit-results.xml'
    }

    parameters {
        choice(
        name: 'TEST_SUITE',
        choices: ['smoke', 'full'],
        description: 'Select the test suite to run'
    )
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

        stage('Type check') {
            steps {
                sh 'npm run typecheck'
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
                        echo "Selected suite: $TEST_SUITE"
                            pwd
                                find tests -type f
                                npx playwright test --project=chromium --grep "@smoke" --list
                        case "$TEST_SUITE" in
                            smoke)
                                mkdir -p test-results
                                echo "artifact check" > test-results/archive-check.txt
                                npx playwright test --project=chromium --grep "@smoke" --reporter=html,junit
                                ;;
                            full)
                                mkdir -p test-results
                                echo "artifact check" > test-results/archive-check.txt
                                npx playwright test --project=chromium --reporter=html,junit
                                ;;
                            *)
                                echo "Invalid TEST_SUITE: $TEST_SUITE"
                                exit 1
                                ;;
                        esac
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
                    artifacts: 'playwright-report/**,test-results/**',
                    allowEmptyArchive: true
                    )
                }
            }
        }
    }
}
