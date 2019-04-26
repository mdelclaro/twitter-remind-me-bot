# Bot for Twitter

## What is this?
This is a Twitter bot that at the moment has the functionality to remind you to check a tweet later, and also to provide a link to download a video/gif.

Currently working on new features for it.

In case you have any suggestions, feel free to contact me, or even better, send a pull request!

## How does it work?
When you mention the bot on Twitter (currently, its username is @_tools_bot) you have the option to run two different commands: "set" and "download"

### 1. The *set* command:
To set a reminder use the `set` command plus the time interval. Time interval examples: 30 minutes, 1 hour, 1 day.

Example: `@_tools_bot set 30 minutes`

### 2. The *download* command:
Simply use the `download` command on any tweet that contains a video or gif and a link will be provided so the file can be downloaded. This link will be valid for 1 hour, after that the file will get deleted.

## How do I run it?

```
$ npm install
$ npm start
```

## Project's simplified structure:

```
.
├── download/                   # Local development download files folder
├── src/                        # Source code
│   ├── controllers/            # Jobs controllers
│   │   └── ...    
│   ├── jobs/                   # The jobs the bot can run 
│   │   └── ...    
│   ├── lib/                    # Libs config (Agenda, Twitter)  
│   │   └── ...    
│   ├── routes/                 # Express app routes to download local files
│   │   └── ... 
│   ├── utils/                  # Util functions (error handling, socket, etc)
│   │   └── ...
├── app.js                      # App starting point
├── config.js                   # App constants
├── Procfile                    # Heroku config
├── server.js                   # Express app to download local files
└── ...                         # Other configuration and standard files
```