#!/bin/bash

# --------------------------------------------
# Export vars for helper scripts to use
# --------------------------------------------
# name of app-sre "application" folder this component lives in; needs to match for quay
export COMPONENT="rhsm"
export APP_NAME=`node -e 'console.log(require("./package.json").insights.appname)'`
export APP_ROOT=$(pwd)
export NODE_BUILD_VERSION=`node -e 'console.log(require("./package.json").engines.node.match(/(\d+)\.\d+\.\d+/)[1])'`
COMMON_BUILDER=https://raw.githubusercontent.com/RedHatInsights/insights-frontend-builder-common/master

# --------------------------------------------
# Options that must be configured by app owner
# --------------------------------------------
IQE_PLUGINS="curiosity"
IQE_MARKER_EXPRESSION="smoke"
IQE_FILTER_EXPRESSION=""

set -exv
# source is preferred to | bash -s in this case to avoid a subshell
source <(curl -sSL $COMMON_BUILDER/src/frontend-build.sh)
BUILD_RESULTS=$?

# Stubbed out for now
mkdir -p $WORKSPACE/artifacts
cat << EOF > $WORKSPACE/artifacts/junit-dummy.xml
<testsuite tests="1">
    <testcase classname="dummy" name="dummytest"/>
</testsuite>
EOF

# teardown_docker
exit $BUILD_RESULTS