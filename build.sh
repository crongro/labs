#!/bin/sh
tar cvzf labs.tar ./*
sftp -i nigayo.pem cloud@114.202.246.197
