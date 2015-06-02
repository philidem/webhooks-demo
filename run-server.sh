ulimit -S -n 2048

BASEDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
MARKO_CLEAN=true node $BASEDIR/node_modules/.bin/browser-refresh "$BASEDIR/server.js" $@
