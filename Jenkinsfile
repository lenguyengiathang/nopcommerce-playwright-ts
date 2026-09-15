pipeline {
    agent any

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