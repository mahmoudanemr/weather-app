pipeline {
    agent any

    environment {
        GIT_BRANCH = 'main'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM',
                    branches: [[name: "*/${GIT_BRANCH}"]],
                    userRemoteConfigs: [[url: 'https://github.com/mahmoudanemr/weather-app.git']]
                ])
            }
        }

        stage('Build & Inject Env') {
            steps {
                withCredentials([string(credentialsId: 'OPENWEATHER_API_KEY', variable: 'API_KEY')]) {
                    // Create the backend .env inside the workspace
                    sh '''
                      cat > backend/.env <<EOF
                      API_KEY=${API_KEY}
                      PORT=3001
                      NODE_ENV=production
                      EOF
                    '''
                    // Build the backend and frontend images
                    sh 'docker build -t weather-backend:latest ./backend'
                    sh """
                      docker build \
                        --build-arg REACT_APP_BACKEND_URL=http://backend:3001 \
                        -t weather-frontend:latest \
                        ./frontend
                    """
                }
            }
        }

        stage('Deploy App Only') {
            steps {
                dir("${WORKSPACE}") {
                    // Tear down just the app services (backend+frontend)
                    sh 'docker compose --profile app down --remove-orphans'
                    // Bring them up fresh
                    sh 'docker compose --profile app up -d --build backend frontend'
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
