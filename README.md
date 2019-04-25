# Bot for Twitter

### Twitter bot that at the moment has only the functionality to remind you to check a tweet later.

Currently working on new features for it. Will try to implement the possibility to download a tweet's media =)

In case you have any suggestions, feel free to contact me, or even better, send a pull request!

## Running:

```
$ npm install
$ npm start
```

## Project's simplified structure:

```
.
├── src/                        # Source code
│   ├── controllers/            # Jobs controllers
│   │   └── ...    
│   ├── jobs/                   # The jobs the bot can run 
│   │   └── ...    
│   ├── lib/                    # Libs config (Agenda, Twitter)  
│   │   └── ...    
│   ├── utils/                  # Util functions (error handling, socket, etc)
│   │   └── ...
├── app.js                      # App starting point
├── config.js                   # App constants
└── ...                         # Other configuration and standard files
```