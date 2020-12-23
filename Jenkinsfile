pipeline {
     agent any
     
     stages {
        stage("Build") {
            steps {
              sh  "/root/scripts/build.sh"
            }
        }
        stage("Lint") {
            steps {
                sh "sudo npm run lint"
            }
        }
        stage("Deploy to production") {
            when {
                branch 'master' 
            }
            steps { 
                sh "/root/scripts/deploy.sh"
            }
        }
    }
}