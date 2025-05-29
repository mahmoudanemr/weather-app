pipeline {
    agent any

    environment {
        // Adjust this if your branch is named differently
        GIT_BRANCH = 'main'
    }

    stages {
        stage('Checkout') {
            steps {
                // Pull the latest from your GitHub repo
                checkout([$class: 'GitSCM',
                    branches: [[name: "*/${GIT_BRANCH}"]],
                    userRemoteConfigs: [[url: 'https://github.com/mahmoudanemr/weather-app.git']]
                ])
            }
        }

        stage('Build & Inject Env') {
            steps {
                // Inject your OpenWeather API key securely
                withCredentials([string(credentialsId: 'OPENWEATHER_API_KEY', variable: 'API_KEY')]) {
                    // Create a .env for the backend
                    sh '''
                      cat > backend/.env <<EOF
                      API_KEY=${API_KEY}
                      PORT=3001
                      NODE_ENV=production
                      EOF
                    '''
                    // Build the backend image
                    sh 'docker build -t weather-backend:latest ./backend'
                    // Build the frontend image, passing in the backend URL
                    sh """
                      docker build \
                        --build-arg REACT_APP_BACKEND_URL=http://192.168.1.13:3001 \
                        -t weather-frontend:latest \
                        ./frontend
                    """
                }
            }
        }

        stage('Deploy') {
            steps {
                // Ensure commands run from the directory with docker-compose.yml
                dir("${WORKSPACE}") {
                    // Tear down any existing containers, remove orphans and volumes
                    sh 'docker compose down --remove-orphans --volumes'
                    // Rebuild and start all services in detached mode
                    sh 'docker compose up -d --build'
                }
            }
        }
    }

    post {
        success {
            echo '✅ Build and deployment succeeded!'
        }
        failure {
            echo '❌ Build failed – check logs for details.'
        }
    }
}
