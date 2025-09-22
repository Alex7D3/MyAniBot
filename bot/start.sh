#!/usr/bin/env sh
set -e
host=redis
port=6379

until nc -z "$host":"$port"; do
	echo "Waiting for $host:$port..."
	sleep 1
done

npn run start
