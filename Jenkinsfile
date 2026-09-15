pipeline {
    agent any

        environment {
        PATH = "/Users/thangle/.nvm/versions/node/v24.15.0/bin:${env.PATH}"
    }

    options {
        disableConcurrentBuilds()
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
    }
}