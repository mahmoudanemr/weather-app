pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Images') {
      steps {
        withCredentials([string(credentialsId: 'OPENWEATHER_API_KEY', variable: 'API_KEY')]) {
          // write a .env file in the workspace
          sh '''
            cat > backend/.env <<EOF
            API_KEY=${API_KEY}
            PORT=3001
            NODE_ENV=production
            EOF
          '''

          // build backend
          sh 'docker build -t weather-backend:latest ./backend'

          // build frontend, injecting the backend URL directly
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
      echo '❌ Build failed – check logs!'
    }
  }
}

