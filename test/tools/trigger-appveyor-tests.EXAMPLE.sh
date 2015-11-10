# export \
# AV_ACCOUNTNAME=my_appveyor_username \
# AV_PROJECTSLUG=cz-cli \
# AV_BRANCH=master \
# AV_TOKEN=my_appveyor_api_token

DIR="$(cd "$(dirname "$0")" && pwd)"
command="node $DIR/trigger-appveyor-tests.js"

safeRunCommand() {
   "$@"

   if [ $? != 0 ]; then
      printf "Error when executing command: '$1 $2'"
      exit $ERROR_CODE
   fi
}
safeRunCommand $command