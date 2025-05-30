pipeline {
    agent any
    environment {
        GIT_BRANCH = 'main'
    }
    stages {
        stage('Checkout') {
            steps {
                sh '''
                    echo "Cleaning workspace..."
                    rm -rf * .git || true
                    
                    echo "Cloning repository..."
                    git clone https://github.com/mahmoudanemr/weather-app.git .
                    
                    echo "Repository cloned successfully!"
                    ls -la
                '''
            }
        }
        stage('Build Images & Inject Env') {
            steps {
                withCredentials([string(credentialsId: 'OPENWEATHER_API_KEY', variable: 'API_KEY')]) {
                    sh '''
                        echo "Creating backend .env file..."
                        cat > backend/.env <<EOF
API_KEY=${API_KEY}
PORT=3001
NODE_ENV=production
EOF
                        echo "Building backend Docker image..."
                        docker build -t weather-backend:latest ./backend
                        
                        echo "Building frontend Docker image..."
                        docker build -t weather-frontend:latest ./frontend
                    '''
                }
            }
        }
        stage('Deploy Backend') {
            steps {
                sh '''
                    echo "Stopping existing backend containers..."
                    docker compose -f docker-compose.backend.yml down --remove-orphans --volumes || true
                    
                    echo "Starting backend containers..."
                    docker compose -f docker-compose.backend.yml up -d
                '''
            }
        }
        stage('Deploy Frontend') {
            steps {
                sh '''
                    echo "Stopping existing frontend containers..."
                    docker compose -f docker-compose.frontend.yml down --remove-orphans --volumes || true
                    
                    echo "Starting frontend containers..."
                    docker compose -f docker-compose.frontend.yml up -d
                '''
            }
        }
        stage('Health Check') {
            steps {
                sh '''
                    echo "Waiting for services to start..."
                    sleep 15
                    
                    echo "Checking running containers..."
                    docker ps
                    
                    echo "Testing backend health..."
                    curl -f http://localhost:3001/health || echo "Backend health check failed"
                    
                    echo "Testing frontend availability..."
                    curl -f http://localhost:3000 || echo "Frontend availability check failed"
                '''
            }
        }
    }
    post {
        success {
            echo '✅ Build and deployment succeeded!'
            echo '🌐 Frontend available at: http://localhost:3000'
            echo '🔧 Backend available at: http://localhost:3001'
        }
        failure {
            echo '❌ Build failed – check logs for details.'
            sh '''
                echo "=== Docker containers status ==="
                docker ps -a
                
                echo "=== Backend logs (last 50 lines) ==="
                docker compose -f docker-compose.backend.yml logs --tail=50 || true
                
                echo "=== Frontend logs (last 50 lines) ==="
                docker compose -f docker-compose.frontend.yml logs --tail=50 || true
            '''
        }
        always {
            sh '''
                echo "=== Cleaning up unused Docker resources ==="
                docker system prune -f || true
            '''
        }
    }
}
