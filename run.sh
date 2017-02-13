#! /bin/sh

# Set up API_URL config for UI
if [ -n "$API_URL" ] ; then
  sed -ie "s@// var VegaDNSHost = \"http://localhost:5000\";@var VegaDNSHost = \"${API_URL}\";@" /opt/vegadns/public/index.html
fi

# Let nginx take PID 1
exec nginx -g "daemon off;"
