# Heroku-AriaNG-21vianet. Heroku-AriaNG

Forked from https://github.com/xinxin8816/heroku-ariang-21vianet

What's new:
1. Refreshed the login page (but it'll load slower than before)
2. Since the "show downloaded files" didn't work, I managed to remove it (I also think that the script originally will move the downloaded files to the Rclone's destination, instead of copy it, so the server won't store those files and it'll run better. You also don't have to wait 30 minutes of inactivity in order to free up the server's storage. I got this inclusion by seeing on-complete.sh, please refer to it, get me know if I was mistaken)

One-click to build AriaNG on Heroku, and upload to cloud drive when the file download completed.<br>

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/sagirisayang/heroku-ariang-21vianet/tree/master)

Using Rclone with 21vianet mod and Aria2, even UNRAR online by command terminal flexibly? Try this [Heroku Rclone 21vianet](https://github.com/xinxin8816/heroku-rclone-21vianet)<br>

This repository forked from maple3142/heroku-aria2c and can't merged.<br>

## Abuse Warning

**This APP designed for best performance so uses a lot of resources.**<br>
**Please be careful with that your Heroku account may be suspend.**<br>

## Improvement

1. Rclone with 21vianet patch and Gclone mod.
2. Support mount double cloud drive.
3. Improve performance of the built-in Aria2c and Rclone.

## Connect Cloud Drive With Rclone

1. Setup Rclone by following [Rclone Docs](https://rclone.org/docs/).<br> 
Optional: using service account setup with [Gclone Rradme](https://github.com/donwa/gclone) to break Google Drive 750GB limit, Chinese users setup with 21vianet patch to connect OneDrive by 21vianet.<br> 
You can find your config from there:

```
Windows: %userprofile%\.config\rclone\rclone.conf
Linux: $HOME/.config/rclone/rclone.conf
```

Rclone with 21vianet patch and Gclone mod provided by xhuang.

2. Open your `rclone.conf` file, it should look like this:

```conf
[DRIVENAME A]
type = WHATEVER
client_id = WHATEVER
client_secret = WHATEVER
scope = WHATEVER
china_version = WHATEVER
token = WHATEVER

[DRIVENAME B]
type = WHATEVER
client_id = WHATEVER
client_secret = WHATEVER
scope = WHATEVER
china_version = WHATEVER
token = WHATEVER

others entries...
```

3. Find the drive you want to use, and copy its `[DRIVENAME A] ...` to  `... token = ...` section.
4. Replace all linebreaks with `\n`
5. Deploy with the button above, and paste that text in `RCLONE_CONFIG`
6. Set `RCLONE_DESTINATION` to a path you want to store your downloaded in `[DRIVENAME A]`, format is `[DRIVENAME A]:[REMOVE PATH A]`
7. If you mount a second cloud drive, Set `RCLONE_DESTINATION_2` same as 6
