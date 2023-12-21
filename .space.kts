job("[BE]-develop") {
    startOn {
        gitPush {
            anyBranchMatching {
                +"develop"
            }
        }
    }

    git {
        refSpec {
            +"refs/heads/develop"
        }
        depth = UNLIMITED_DEPTH
    }

    container(displayName = "Push heroku remote", image = "alpine:3.18") {
        env["HEROKU_API_KEY"] = "{{ project:HEROKU_API_KEY }}"

        shellScript {
            content = """
                apk update
                apk add git
                echo "Git Version:"
                git --version

                git switch develop
                echo "Git Status:"
                git status

                git remote add heroku https://token:${'$'}HEROKU_API_KEY@git.heroku.com/bi-arecibo.git
                git push heroku develop:main -f
            """
        }
    }
}