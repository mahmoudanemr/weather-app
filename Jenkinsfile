pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build & Inject Env') {
            steps {
                withCredentials([string(credentialsId: 'OPENWEATHER_API_KEY', variable: 'API_KEY')]) {
                    // Generate .env for backend
                    sh '''
                      cat > backend/.env <<EOF
                      API_KEY=${API_KEY}
                      PORT=3001
                      NODE_ENV=production
                      EOF
                    '''
                    // Build backend image
                    sh 'docker build -t weather-backend:latest ./backend'
                    // Build frontend image with baked-in backend URL
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
                // Ensure we're in the dir with docker-compose.yml
                dir("${WORKSPACE}") {
                    // Tear down any old containers (and remove orphaned ones & volumes)
                    sh 'docker compose down --remove-orphans --volumes'
                    // Build & start fresh
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
            echo '❌ Build failed – check logs!'
        }
    }
}

