pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Prepare Env') {
            steps {
                // Copy the backend .env into Jenkins workspace
                sh 'cp /home/mrlinux/weather-app/backend/.env ${WORKSPACE}/backend/.env'
            }
        }

        stage('Build Images') {
            steps {
                sh 'docker build -t weather-backend:latest ./backend'
                sh """
                  docker build \
                    --build-arg REACT_APP_BACKEND_URL=http://192.168.1.13:3001 \
                    -t weather-frontend:latest \
                    ./frontend
                """
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker compose down || true'
                sh 'docker compose up -d'
            }
        }
    }

    post {
        success {
            echo '✅ Build and deployment succeeded!'
        }
        failure {
            echo '❌ Something went wrong.'
        }
    }
}

