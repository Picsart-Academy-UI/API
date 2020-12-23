pipeline {
     agent any
     
     stages {
        stage("Build") {
            steps {
              sh  "sudo /root/scripts/build.sh"
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
                sh "sudo /root/scripts/deploy.sh"
            }
        }
    }
}