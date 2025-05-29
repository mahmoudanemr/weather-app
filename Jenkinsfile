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
                    sh '''
                      cat > backend/.env <<EOF
                      API_KEY=${API_KEY}
                      PORT=3001
                      NODE_ENV=production
                      EOF
                    '''
                    docker.image('docker.io/docker:stable-dind').inside('--privileged') {
                        sh 'docker build -t weather-backend:latest ./backend'
                        sh """
                          docker build \
                            --build-arg REACT_APP_BACKEND_URL=http://192.168.1.13:3001 \
                            -t weather-frontend:latest \
                            ./frontend
                        """
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                // Ensure we're in the right directory
                dir("${WORKSPACE}") {
                    // Clean up any old containers (and their volumes), remove orphans
                    sh 'docker compose down --remove-orphans --volumes'
                    // Build and start fresh in detached mode
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

