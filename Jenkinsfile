pipeline {
  agent any

  environment {
    // Tell Docker where to find your code
    DOCKER_HOST = 'unix:///var/run/docker.sock'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Images') {
      steps {
        // Build backend
        sh 'docker build -t weather-backend:latest ./backend'
        // Build frontend (passes in the VM IP for browser)
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
        // Tear down any existing containers
        sh 'docker compose down || true'
        // Bring your stack up in detached mode
        sh 'docker compose up -d'
      }
    }
  }

  post {
    success {
      echo '✅ Build and deployment succeeded!'
    }
    failure {
      echo '❌ Something went wrong, check the console output.'
    }
  }
}
