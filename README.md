[![Build Status](https://travis-ci.org/tdantas/node-bash.env.svg)](https://travis-ci.org/tdantas/node-bash.env) [![Code Climate](https://codeclimate.com/github/tdantas/node-bash.env/badges/gpa.svg)](https://codeclimate.com/github/tdantas/node-bash.env)


Suppose your upstart script is something like that

```
description "Simple upstart Script from my Node project"

start on started networking
stop on runlevel [016]

respawn

env MAIL_FROM='noreply@mail.com'
export MAIL_FROM

pre-start script
  . /apps/myproject/.env
end script

script
  exec /usr/bin/node /apps/simple.js
end script
```

The upstart section above is [sourcing](http://upstart.ubuntu.com/cookbook/#sourcing-files) the /apps/myproject/.env file. this technique enable us to load the environment variables that will be used your application.

The same .env file from your application is used in the upstart/bash script.

**/apps/myproject/.env**
````
export NODE_ENV=production
export API_SECRET=1239012389084327897450-231
export VERBOSE=false
export MAIL_FORM='tdantas@email.com'
````

In the above snippet, **MAIL_FROM** was defined in the upstart script and in the configuration file [ /apps/myproject/.env ]. by default the bash.env will *not override* defined environment variables.

### Usage
```
  var source = require('bash.env');
  source.load(); # will attach the .env variables to process.env
```

### API

#### #load
  options: Object
  ````
    path: [.env] The path to .env file.
    override: [false] if false will not override pre defined environment variable.
    loadTo: [process.env] object that will attach the definitions from config file
    
    
    var obj = {};
    source.load({ path: '/etc/app/config', override: true, loadTo: obj });
  ```
  options: String
  ```
    the path to .env file
    
    
    source.load('/etc/app/config');
  ```
  


